import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import LaunchDetails from "@/containers/launch-details/launch-details.jsx";
import { useParams } from "@modern-js/runtime/router";

function Blog() {
  const { id } = useParams();

  return (
    <RestAPIProvider>
      <LaunchDetails launchId={Number(id)} />
    </RestAPIProvider>
  );
}

export default Blog;
