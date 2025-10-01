import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import RequestsList from "@/components/webhook/RequestsList";
import RequestDetails from "@/components/webhook/RequestDetails";

interface WebhookEndpoint {
  id: string;
  endpoint_key: string;
  name: string;
  created_at: string;
}

interface WebhookRequest {
  id: string;
  method: string;
  headers: any;
  body: any;
  query_params: any;
  ip_address: string | null;
  created_at: string;
}

const WebhookViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEndpoint = async () => {
      const { data, error } = await supabase
        .from("webhook_endpoints")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Endpoint not found");
        navigate("/dashboard");
        return;
      }

      setEndpoint(data);
    };

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("webhook_requests")
        .select("*")
        .eq("endpoint_id", id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) {
        setRequests(data);
        if (data.length > 0 && !selectedRequest) {
          setSelectedRequest(data[0]);
        }
      }
      setLoading(false);
    };

    fetchEndpoint();
    fetchRequests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`webhook_requests_${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "webhook_requests",
          filter: `endpoint_id=eq.${id}`,
        },
        (payload) => {
          const newRequest = payload.new as WebhookRequest;
          setRequests((prev) => [newRequest, ...prev].slice(0, 100));
          setSelectedRequest(newRequest);
          toast.success(`New ${newRequest.method} request received`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate, selectedRequest]);

  const copyUrl = () => {
    if (endpoint) {
      const url = `https://vbruwgilbqztxxqllknu.supabase.co/functions/v1/webhook-receiver/${endpoint.endpoint_key}`;
      navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    }
  };

  const deleteEndpoint = async () => {
    if (!endpoint) return;
    
    const { error } = await supabase
      .from("webhook_endpoints")
      .delete()
      .eq("id", endpoint.id);

    if (error) {
      toast.error("Failed to delete endpoint");
    } else {
      toast.success("Endpoint deleted");
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!endpoint) return null;

  const webhookUrl = `https://vbruwgilbqztxxqllknu.supabase.co/functions/v1/webhook-receiver/${endpoint.endpoint_key}`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{endpoint.name}</h1>
                <code className="text-sm text-muted-foreground">{webhookUrl}</code>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
              <Button variant="destructive" size="sm" onClick={deleteEndpoint}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RequestsList
              requests={requests}
              selectedRequest={selectedRequest}
              onSelectRequest={setSelectedRequest}
            />
          </div>
          <div className="lg:col-span-2">
            <RequestDetails request={selectedRequest} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookViewer;
