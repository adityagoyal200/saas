import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface WebhookRequest {
  id: string;
  method: string;
  headers: any;
  body: any;
  query_params: any;
  ip_address: string | null;
  created_at: string;
}

interface RequestDetailsProps {
  request: WebhookRequest | null;
}

const RequestDetails = ({ request }: RequestDetailsProps) => {
  if (!request) {
    return (
      <Card className="p-8 text-center border-border bg-card">
        <p className="text-muted-foreground">
          Select a request to view its details
        </p>
      </Card>
    );
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500",
      POST: "bg-green-500",
      PUT: "bg-yellow-500",
      DELETE: "bg-red-500",
      PATCH: "bg-purple-500",
    };
    return colors[method] || "bg-gray-500";
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge className={getMethodColor(request.method)}>
              {request.method}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(request.created_at), "PPpp")}
            </span>
          </div>
          {request.ip_address && (
            <span className="text-xs text-muted-foreground">
              IP: {request.ip_address}
            </span>
          )}
        </div>

        <Tabs defaultValue="body" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="query">Query Params</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4">
            <div className="rounded-lg bg-code-background p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{JSON.stringify(request.body, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            <div className="rounded-lg bg-code-background p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{JSON.stringify(request.headers, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="query" className="mt-4">
            <div className="rounded-lg bg-code-background p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{JSON.stringify(request.query_params || {}, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RequestDetails;
