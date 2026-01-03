import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Something went wrong", onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-12 w-12 mb-4 text-destructive" />
      <p className="text-lg text-foreground mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
