"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/CampaignRegisterForm.module.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function CampaignRegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    mainImage: null,
    title: '',
    detailInfo: '',
    mainGoal: '',
    missions: [''],
    keywords: [''],
    requirements: [''],
    participationInfo: {
      recruitmentPeriod: { start: null, end: null },
      participationPeriod: { start: null, end: null },
      selectionDate: null,
      recruitmentCount: ''
    },
    productPage: ''
  });

  const steps = [
    { name: '이미지', icon: '📷' },
    { name: '상세 정보', icon: '📋' },
    { name: '제목', icon: '✏️' },
    { name: '주요 목표', icon: '🎯' },
    { name: '미션', icon: '📝' },
    { name: '키워드', icon: '🏷️' },
    { name: '필수 요건', icon: '⚠️' },
    { name: '참여 정보', icon: '👥' },
    { name: '링크', icon: '🔗' }
  ];

  const stepColors = [
    '#FFE5E5', '#FFF4E5', '#FFFACD', '#F5FFE5', 
    '#E5FFF4', '#E5F4FF', '#E5E5FF', '#F0E5FF', '#F9E5FF'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      participationInfo: {
        ...prev.participationInfo,
        [field]: value
      }
    }));
  };

  const handlePeriodChange = (field, type, value) => {
    setFormData(prev => ({
      ...prev,
      participationInfo: {
        ...prev.participationInfo,
        [field]: {
          ...prev.participationInfo[field],
          [type]: value
        }
      }
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          mainImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProgress = () => {
    let completed = 0;
    if (formData.mainImage) completed++;
    if (formData.detailInfo) completed++;
    if (formData.title) completed++;
    if (formData.mainGoal) completed++;
    if (formData.missions.some(m => m)) completed++;
    if (formData.keywords.some(k => k)) completed++;
    if (formData.requirements.some(r => r)) completed++;
    if (formData.participationInfo.recruitmentPeriod.start && 
        formData.participationInfo.recruitmentPeriod.end) completed++;
    if (formData.productPage) completed++;
    
    return completed;
  };

  const progress = updateProgress();

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <h3>등록 절차</h3>
            <span>{progress} / 9 완료</span>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(progress / 9) * 100}%` }}
            />
          </div>
          
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepItem}>
                <div 
                  className={`${styles.stepCircle} ${progress > index ? styles.completed : ''}`}
                  style={{ 
                    backgroundColor: progress > index ? stepColors[index] : '#D1D5DB',
                    color: progress > index ? '#594A3E' : '#6B7280'
                  }}
                >
                  {progress > index ? '✓' : step.icon}
                </div>
                <span className={styles.stepName}>{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <form className={styles.form}>
          {/* 캠페인 메인 이미지 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              캠페인 메인 이미지 <span className={styles.required}>*</span>
            </label>
            <div className={styles.imageUploadArea}>
              {formData.mainImage ? (
                <div className={styles.imagePreview}>
                  <Image 
                    src={formData.mainImage} 
                    alt="Preview" 
                    width={200} 
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.uploadIcon}>
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none">
                      <path d="M22.5 0L45 18H36V36H9V18H0L22.5 0Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <p>파일을 업로드 해주세요.</p>
                  <span>PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className={styles.uploadButton}>
                    이미지 선택
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 캠페인 제목 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              캠페인 제목 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="캠페인 제목을 입력해주세요"
              className={styles.input}
            />
          </div>

          {/* 상품 상세 정보 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              상품 상세 정보 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.detailInfo}
              onChange={(e) => handleInputChange('detailInfo', e.target.value)}
              placeholder="상품 상세 정보를 입력해주세요"
              className={styles.input}
            />
          </div>

          {/* 주요 목표 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              주요 목표 <span className={styles.required}>*</span>
            </label>
            <textarea
              value={formData.mainGoal}
              onChange={(e) => handleInputChange('mainGoal', e.target.value)}
              placeholder="캠페인의 주요 목표를 입력해주세요"
              className={styles.textarea}
              rows={4}
            />
          </div>

          {/* 캠페인 미션 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              캠페인 미션 <span className={styles.required}>*</span>
            </label>
            {formData.missions.map((mission, index) => (
              <div key={index} className={styles.arrayFieldContainer}>
                <input
                  type="text"
                  value={mission}
                  onChange={(e) => handleArrayFieldChange('missions', index, e.target.value)}
                  placeholder="캠페인 미션을 입력해주세요"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('missions', index)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('missions')}
              className={styles.addButton}
            >
              + 미션 추가
            </button>
          </div>

          {/* 키워드 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              키워드 <span className={styles.required}>*</span>
            </label>
            {formData.keywords.map((keyword, index) => (
              <div key={index} className={styles.arrayFieldContainer}>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => handleArrayFieldChange('keywords', index, e.target.value)}
                  placeholder="키워드를 입력해주세요"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('keywords', index)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('keywords')}
              className={styles.addButton}
            >
              + 키워드 추가
            </button>
          </div>

          {/* 필수 요건 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              필수 요건 <span className={styles.required}>*</span>
            </label>
            {formData.requirements.map((requirement, index) => (
              <div key={index} className={styles.arrayFieldContainer}>
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                  placeholder="필수 요건을 입력해주세요"
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('requirements', index)}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className={styles.addButton}
            >
              + 요건 추가
            </button>
          </div>

          {/* 캠페인 참여 정보 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              캠페인 참여 정보 <span className={styles.required}>*</span>
            </label>
            
            <div className={styles.dateSection}>
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>체험단 모집 기간</label>
                <div className={styles.dateInputs}>
                  <DatePicker
                    selected={formData.participationInfo.recruitmentPeriod.start}
                    onChange={(date) => handlePeriodChange('recruitmentPeriod', 'start', date)}
                    placeholderText="시작일"
                    className={styles.datePicker}
                  />
                  <span>~</span>
                  <DatePicker
                    selected={formData.participationInfo.recruitmentPeriod.end}
                    onChange={(date) => handlePeriodChange('recruitmentPeriod', 'end', date)}
                    placeholderText="종료일"
                    className={styles.datePicker}
                  />
                </div>
              </div>

              <div className={styles.dateField}>
                <label className={styles.dateLabel}>체험단 선정일</label>
                <DatePicker
                  selected={formData.participationInfo.selectionDate}
                  onChange={(date) => handleDateChange('selectionDate', date)}
                  placeholderText="선정일을 선택해주세요"
                  className={styles.datePicker}
                />
              </div>

              <div className={styles.dateField}>
                <label className={styles.dateLabel}>체험단 참여 기간</label>
                <div className={styles.dateInputs}>
                  <DatePicker
                    selected={formData.participationInfo.participationPeriod.start}
                    onChange={(date) => handlePeriodChange('participationPeriod', 'start', date)}
                    placeholderText="시작일"
                    className={styles.datePicker}
                  />
                  <span>~</span>
                  <DatePicker
                    selected={formData.participationInfo.participationPeriod.end}
                    onChange={(date) => handlePeriodChange('participationPeriod', 'end', date)}
                    placeholderText="종료일"
                    className={styles.datePicker}
                  />
                </div>
              </div>

              <div className={styles.dateField}>
                <label className={styles.dateLabel}>체험단 모집 인원</label>
                <input
                  type="number"
                  value={formData.participationInfo.recruitmentCount}
                  onChange={(e) => handleInputChange('participationInfo', {
                    ...formData.participationInfo,
                    recruitmentCount: e.target.value
                  })}
                  placeholder="모집 인원을 입력해주세요"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* 상품 판매 페이지 */}
          <div className={styles.formSection}>
            <label className={styles.label}>
              상품 판매 페이지 <span className={styles.required}>*</span>
            </label>
            <input
              type="url"
              value={formData.productPage}
              onChange={(e) => handleInputChange('productPage', e.target.value)}
              placeholder="상품 판매 페이지를 입력해주세요"
              className={styles.input}
            />
          </div>
        </form>
      </div>

      <div className={styles.buttonSection}>
        <button type="button" className={styles.cancelButton}>
          취소
        </button>
        <button type="submit" className={styles.submitButton}>
          캠페인 등록
        </button>
      </div>
    </div>
  );
}
