import styles from "../styles/CampaignListPage.module.css";
import Header from "./Header";
import FilterTabs from "./FilterTabs";
import SearchAndSort from "./SearchAndSort";
import CampaignGrid from "./CampaignGrid";
import Pagination from "./Pagination";

export default function CampaignListPage() {
  return (
    <div className={styles.campaignListPage}>
      <main className={styles.mainContent}>
        <div className="container">
          <Header />
          <FilterTabs />
          <SearchAndSort />
          <CampaignGrid />
          <Pagination />
        </div>
      </main>
    </div>
  );
}