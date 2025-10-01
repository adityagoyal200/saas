import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface WebhookRequest {
  id: string;
  method: string;
  headers: any;
  body: any;
  query_params: any;
  ip_address: string | null;
  created_at: string;
}

interface RequestsListProps {
  requests: WebhookRequest[];
  selectedRequest: WebhookRequest | null;
  onSelectRequest: (request: WebhookRequest) => void;
}

const RequestsList = ({ requests, selectedRequest, onSelectRequest }: RequestsListProps) => {
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "text-blue-400",
      POST: "text-green-400",
      PUT: "text-yellow-400",
      DELETE: "text-red-400",
      PATCH: "text-purple-400",
    };
    return colors[method] || "text-gray-400";
  };

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center border-border bg-card">
        <p className="text-muted-foreground">
          No requests yet. Send a request to your webhook URL to see it here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">
        Requests ({requests.length})
      </h2>
      <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {requests.map((request) => (
          <Card
            key={request.id}
            className={cn(
              "p-4 cursor-pointer border hover:border-primary transition-colors",
              selectedRequest?.id === request.id
                ? "border-primary bg-muted"
                : "border-border bg-card"
            )}
            onClick={() => onSelectRequest(request)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={cn("font-mono font-semibold", getMethodColor(request.method))}>
                {request.method}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {JSON.stringify(request.body).substring(0, 50)}...
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequestsList;
