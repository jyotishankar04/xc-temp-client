"use client";

import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceWizard } from "../create-service-provider";

export function BasicInfoStep() {
  const { state, updateState, goBack, goNext, canContinue } = useCreateServiceWizard();

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="rounded-md border bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Github className="size-4" />
            {state.selectedRepo?.fullName}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Default branch: {state.selectedRepo?.defaultBranch}
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="service-name">Service Name *</Label>
            <Input
              id="service-name"
              value={state.name}
              onChange={(event) => updateState({ name: event.target.value })}
              placeholder="payments-api"
            />
          </div>

          <div className="grid gap-2">
            <Label>Environment *</Label>
            <Select
              value={state.env}
              onValueChange={(env) => updateState({ env })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRODUCTION">Production</SelectItem>
                <SelectItem value="STAGING">Staging</SelectItem>
                <SelectItem value="DEVELOPMENT">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              value={state.description}
              onChange={(event) => updateState({ description: event.target.value })}
              placeholder="Payment processing API for customer transactions..."
              className="min-h-28"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={!canContinue}>
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
