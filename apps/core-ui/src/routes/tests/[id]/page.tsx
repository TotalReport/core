import { RestAPIProvider } from '@/components/providers/rest-api-provider.jsx';
import { TestDetails } from '@/containers/test-details/test-details.jsx';
import { useParams } from '@modern-js/runtime/router';

function TestDetailsPage() {
  const { id } = useParams();

  return (
    <RestAPIProvider>
      <TestDetails entityId={Number(id)} />
    </RestAPIProvider>
  );
}

export default TestDetailsPage;

