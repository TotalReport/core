import { RestAPIProvider } from '@/components/providers/rest-api-provider.jsx';
import { ReportsPageContainer } from '@/components/reports/reports-page-container.jsx';


const ReportsPage = () => {
  return (
    <div>
      <RestAPIProvider>
        <ReportsPageContainer />
      </RestAPIProvider>
    </div>
  );
};

export default ReportsPage;
