import { Film } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "No movies found" }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Film className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;
