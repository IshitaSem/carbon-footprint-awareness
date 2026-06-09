"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseStoredCalculatorInputs } from "@/lib/validation";
import type { CalculatorInputs } from "@/types";

interface StoredCalculatorInputsState {
  inputs: CalculatorInputs | null;
  isLoading: boolean;
}

export function useStoredCalculatorInputs(): StoredCalculatorInputsState {
  const router = useRouter();
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("carbonInputs");
    const parsedInputs = parseStoredCalculatorInputs(stored);

    if (!parsedInputs) {
      router.replace("/calculator");
      return;
    }

    setInputs(parsedInputs);
    setIsLoading(false);
  }, [router]);

  return { inputs, isLoading };
}
