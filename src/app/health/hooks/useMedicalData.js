"use client";

import { useState, useCallback } from "react";
import { useMedication } from "./useMedication";
import { useCare } from "./useCare";

export function useMedicalData() {
  const medication = useMedication();
  const care = useCare();
  
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingType, setEditingType] = useState("");
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState("");

  // 캘린더 이벤트 상태
  const [calendarEvents, setCalendarEvents] = useState([]);

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive");

  // OCR 결과 상태
  const [ocrResult, setOcrResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  // 페이징 상태
  const [medicationPage, setMedicationPage] = useState(1);
  const [carePage, setCarePage] = useState(1);
  const [vaccinationPage, setVaccinationPage] = useState(1);

  // 필터 상태
  const [medicationFilter, setMedicationFilter] = useState("전체");
  const [careFilter, setCareFilter] = useState("전체");
  const [vaccinationFilter, setVaccinationFilter] = useState("전체");

  // 토스트 메시지 표시
  const showToastMessage = useCallback((message, type = "inactive") => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // 편집할 데이터 설정
  const setEditingData = useCallback((data, type) => {
    if (type === "medication") {
      setEditingMedication(data);
    } else {
      setEditingSchedule(data);
      setEditingType(type);
    }
  }, []);

  // 편집 데이터 초기화
  const clearEditingData = useCallback(() => {
    setEditingMedication(null);
    setEditingSchedule(null);
    setEditingType("");
  }, []);

  // 삭제할 데이터 설정
  const setDeleteData = useCallback((id, type) => {
    setToDeleteId(id);
    setDeleteType(type);
  }, []);

  // 삭제 데이터 초기화
  const clearDeleteData = useCallback(() => {
    setToDeleteId(null);
    setDeleteType("");
  }, []);

  // 페이지 리셋
  const resetPages = useCallback(() => {
    setMedicationPage(1);
    setCarePage(1);
    setVaccinationPage(1);
  }, []);

  // 필터 리셋
  const resetFilters = useCallback(() => {
    setMedicationFilter("전체");
    setCareFilter("전체");
    setVaccinationFilter("전체");
  }, []);

  // 모든 상태 초기화
  const resetAll = useCallback(() => {
    clearEditingData();
    clearDeleteData();
    resetPages();
    resetFilters();
    setSelectedSchedule(null);
    setCalendarEvents([]);
    setToastMessage("");
    setToastType("inactive");
    setOcrResult(null);
    setErrorMessage("");
    setErrorDetails("");
  }, [clearEditingData, clearDeleteData, resetPages, resetFilters]);

  return {
    // 데이터 훅들
    medication,
    care,
    
    // 선택된 데이터
    selectedSchedule,
    editingMedication,
    editingSchedule,
    editingType,
    toDeleteId,
    deleteType,
    
    // UI 상태
    calendarEvents,
    toastMessage,
    toastType,
    ocrResult,
    errorMessage,
    errorDetails,
    
    // 페이징 상태
    medicationPage,
    carePage,
    vaccinationPage,
    
    // 필터 상태
    medicationFilter,
    careFilter,
    vaccinationFilter,
    
    // 상태 설정 함수들
    setSelectedSchedule,
    setEditingData,
    clearEditingData,
    setDeleteData,
    clearDeleteData,
    setCalendarEvents,
    showToastMessage,
    setOcrResult,
    setErrorMessage,
    setErrorDetails,
    
    // 페이징 함수들
    setMedicationPage,
    setCarePage,
    setVaccinationPage,
    
    // 필터 함수들
    setMedicationFilter,
    setCareFilter,
    setVaccinationFilter,
    
    // 리셋 함수들
    resetPages,
    resetFilters,
    resetAll,
  };
}
