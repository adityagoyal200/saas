import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Endpoint {
  id: string;
  endpoint_key: string;
  name: string;
  created_at: string;
}

const EndpointsList = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEndpoints = async () => {
      const { data, error } = await supabase
        .from("webhook_endpoints")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setEndpoints(data);
      }
      setLoading(false);
    };

    fetchEndpoints();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading endpoints...</div>;
  }

  if (endpoints.length === 0) {
    return (
      <Card className="p-12 text-center border-border bg-card">
        <p className="text-muted-foreground mb-4">
          No webhook endpoints yet. Create your first one to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {endpoints.map((endpoint) => (
        <Link key={endpoint.id} to={`/webhook/${endpoint.id}`}>
          <Card className="p-6 border-border bg-card hover:border-primary transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{endpoint.name}</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <code className="text-xs text-muted-foreground block mb-3 break-all">
              /hook/{endpoint.endpoint_key}
            </code>
            <p className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(endpoint.created_at), { addSuffix: true })}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default EndpointsList;
