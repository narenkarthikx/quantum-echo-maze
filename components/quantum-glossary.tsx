"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Atom, BrainCircuit, Waves, Zap } from "lucide-react"

export function QuantumGlossary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Quantum Physics Glossary
        </CardTitle>
        <CardDescription>
          Quick reference guide to quantum terms used in the game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="quantum-echo">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-chart-3" />
                <span>Quantum Echo</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm mb-2">
                A game mechanic that simulates how quantum states evolve and change over time. When activated, 
                it replays your movement path with random quantum perturbations to demonstrate uncertainty principles.
              </p>
              <p className="text-sm text-muted-foreground">
                In real quantum physics: Similar to how quantum states can be perturbed by measurement and environment.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="fidelity">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fidelity</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm mb-2">
                Measures how accurately your original path is reproduced during a Quantum Echo. 
                Higher fidelity (closer to 100%) means less quantum noise and better quantum control.
              </p>
              <p className="text-sm text-muted-foreground">
                In real quantum physics: Quantifies how well a quantum system maintains its state during operations,
                critical for quantum computing and communication.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="decoherence">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-accent" />
                <span>Decoherence</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm mb-2">
                The process by which quantum systems lose their quantum properties due to interaction with the environment. 
                In the game, this causes paths to deviate during Quantum Echo.
              </p>
              <p className="text-sm text-muted-foreground">
                In real quantum physics: A major challenge for quantum computing - quantum bits (qubits) can lose their
                information through decoherence, requiring error correction techniques.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="perturbation">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-primary" />
                <span>Perturbation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm mb-2">
                Random deviations in your path during Quantum Echo. These represent quantum uncertainty and
                show how quantum systems can behave unpredictably.
              </p>
              <p className="text-sm text-muted-foreground">
                In real quantum physics: Small changes to a quantum system that can dramatically alter its behavior,
                demonstrating the sensitivity of quantum states.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="coherence-time">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-chart-3" />
                <span>Coherence Time</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm mb-2">
                How long a quantum system maintains its quantum properties before decoherence takes over.
                In Lab Mode, you can experiment with parameters that affect coherence time.
              </p>
              <p className="text-sm text-muted-foreground">
                In real quantum physics: A critical metric for quantum computers - longer coherence times
                allow more complex quantum calculations before errors occur.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
