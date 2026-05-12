"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  useConnectGitHub,
  useCreateApiKey,
  useCreateService,
} from "@/lib/hooks";
import type {
  ApiKey,
  CreateServiceInput,
  DeploymentType,
  GitHubRepo,
  Service,
} from "@/lib/types/service";

const STORAGE_KEY = "xecurecode:create-service-wizard";

export type CreateServiceState = {
  selectedRepo: GitHubRepo | null;
  name: string;
  env: string;
  description: string;
  defaultBranch: string;
  deploymentType: DeploymentType;
  rollbackWorkflow: string;
  autoRollbackEnabled: boolean;
  autoRollbackThreshold: number;
  createdService: Service | null;
  apiKey: ApiKey | null;
};

type CreateServiceContextValue = {
  state: CreateServiceState;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
  canContinue: boolean;
  setCurrentStep: (step: number) => void;
  updateState: (patch: Partial<CreateServiceState>) => void;
  goNext: () => void;
  goBack: () => void;
  connectGitHub: () => Promise<void>;
  createService: () => Promise<void>;
  resetWizard: () => void;
};

const initialState: CreateServiceState = {
  selectedRepo: null,
  name: "",
  env: "DEVELOPMENT",
  description: "",
  defaultBranch: "main",
  deploymentType: "GITHUB_ACTIONS",
  rollbackWorkflow: "",
  autoRollbackEnabled: false,
  autoRollbackThreshold: 85,
  createdService: null,
  apiKey: null,
};

const CreateServiceContext = createContext<CreateServiceContextValue | null>(null);

function getInitialWizardSnapshot() {
  if (typeof window === "undefined") {
    return { state: initialState, currentStep: 0 };
  }

  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { state: initialState, currentStep: 0 };
    }
    const parsed = JSON.parse(saved) as {
      state?: Partial<CreateServiceState>;
      currentStep?: number;
    };
    return {
      state: { ...initialState, ...parsed.state },
      currentStep: parsed.currentStep ?? 0,
    };
  } catch {
    return { state: initialState, currentStep: 0 };
  }
}

export function CreateServiceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [initialSnapshot] = useState(getInitialWizardSnapshot);
  const [state, setState] = useState<CreateServiceState>(initialSnapshot.state);
  const [currentStep, setCurrentStepState] = useState(initialSnapshot.currentStep);
  const [error, setError] = useState<string | null>(null);
  const createServiceMutation = useCreateService();
  const createApiKeyMutation = useCreateApiKey();
  const connectGitHubMutation = useConnectGitHub();

  useEffect(() => {
    if (state.createdService) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state, currentStep }));
    } catch {
      // storage blocked (sandboxed context, private mode, etc.)
    }
  }, [currentStep, state]);

  useEffect(() => {
    const hasDraft =
      !!state.selectedRepo ||
      !!state.name ||
      !!state.description ||
      state.env !== initialState.env ||
      state.deploymentType !== initialState.deploymentType;

    if (!hasDraft || state.createdService) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state]);

  const updateState = useCallback((patch: Partial<CreateServiceState>) => {
    setState((current) => ({ ...current, ...patch }));
    setError(null);
  }, []);

  const validateStep = useCallback(
    (step: number) => {
      if (step === 0) return !!state.selectedRepo;
      if (step === 1) return !!state.name.trim() && !!state.env;
      if (step === 2) return !!state.defaultBranch && !!state.deploymentType;
      if (step === 3) return true;
      if (step === 4) return !!state.selectedRepo && !!state.name.trim();
      return true;
    },
    [state]
  );

  const setCurrentStep = useCallback(
    (step: number) => {
      if (step <= currentStep || validateStep(currentStep)) {
        setCurrentStepState(Math.max(0, Math.min(step, 5)));
      }
    },
    [currentStep, validateStep]
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) {
      setError("Complete the required fields before continuing.");
      return;
    }
    setError(null);
    setCurrentStepState((step) => Math.min(step + 1, 5));
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    setError(null);
    setCurrentStepState((step) => Math.max(step - 1, 0));
  }, []);

  const connectGitHub = useCallback(async () => {
    const redirectUrl = `${window.location.origin}/app/dashboard/services/new`;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state, currentStep }));
    const result = await connectGitHubMutation.mutateAsync(redirectUrl);
    if (result?.url) {
      window.location.href = result.url;
    }
  }, [connectGitHubMutation, currentStep, state]);

  const createService = useCallback(async () => {
    if (!state.selectedRepo) {
      setError("Select a GitHub repository before creating the service.");
      return;
    }

    setError(null);
    const payload: CreateServiceInput = {
      name: state.name.trim(),
      env: state.env,
      description: state.description.trim() || undefined,
      githubRepoId: state.selectedRepo.id,
      githubRepoName: state.selectedRepo.name,
      githubRepoFullName: state.selectedRepo.fullName,
      defaultBranch: state.defaultBranch,
      deploymentType: state.deploymentType,
      rollbackWorkflow: state.rollbackWorkflow || undefined,
      autoRollbackEnabled: state.autoRollbackEnabled,
      autoRollbackThreshold: state.autoRollbackThreshold,
    };

    const service = await createServiceMutation.mutateAsync(payload);
    if (!service?.id) {
      setError("Service was created, but the backend did not return a service id.");
      return;
    }

    let key: ApiKey | null = null;
    try {
      key = (await createApiKeyMutation.mutateAsync({
        serviceId: service.id,
        data: { name: "Default SDK key" },
      })) ?? null;
    } catch {
      key = null;
    }

    setState((current) => ({
      ...current,
      createdService: service,
      apiKey: key,
    }));
    setCurrentStepState(5);
    sessionStorage.removeItem(STORAGE_KEY);
  }, [createApiKeyMutation, createServiceMutation, state]);

  const resetWizard = useCallback(() => {
    setState(initialState);
    setCurrentStepState(0);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const canContinue = validateStep(currentStep);
  const isSubmitting =
    createServiceMutation.isPending ||
    createApiKeyMutation.isPending ||
    connectGitHubMutation.isPending;

  const value = useMemo<CreateServiceContextValue>(
    () => ({
      state,
      currentStep,
      isSubmitting,
      error,
      canContinue,
      setCurrentStep,
      updateState,
      goNext,
      goBack,
      connectGitHub,
      createService,
      resetWizard: () => {
        resetWizard();
        router.refresh();
      },
    }),
    [
      canContinue,
      connectGitHub,
      createService,
      currentStep,
      error,
      goBack,
      goNext,
      isSubmitting,
      resetWizard,
      router,
      setCurrentStep,
      state,
      updateState,
    ]
  );

  return (
    <CreateServiceContext.Provider value={value}>
      {children}
    </CreateServiceContext.Provider>
  );
}

export function useCreateServiceWizard() {
  const context = useContext(CreateServiceContext);
  if (!context) {
    throw new Error("useCreateServiceWizard must be used inside CreateServiceProvider");
  }
  return context;
}
