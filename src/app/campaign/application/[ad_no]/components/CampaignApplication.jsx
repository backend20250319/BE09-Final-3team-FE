"use client"

import React, { useState } from 'react';
import styles from "../styles/CampaignApplication.module.css";
import PetProfile from './PetProfile';
import CampaignInfo from './CampaignInfo';

export default function CampaignApplication({ campaignData, adImage, advImage }) {

  return (
    <div>
      <div className={styles.mainContent}>
        <PetProfile />
        <CampaignInfo campaignData={campaignData} adImage={adImage} advImage={advImage} />
      </div>
    </div>
  );
}
