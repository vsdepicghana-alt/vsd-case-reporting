import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ NEW
import WizardLayout from "./components/WizardLayout";
import IntroAndOfficer from "./components/FormSections/IntroAndOfficer";
import GeneralCase from "./components/FormSections/GeneralCase";
import AnimalInfo from "./components/FormSections/AnimalInfo";
import ClinicalInfo from "./components/FormSections/ClinicalInfo";
import LabDiagnostics from "./components/FormSections/LabDiagnostics";
import ControlMeasures from "./components/FormSections/ControlMeasures";
import PostMortemLesions from "./components/FormSections/PostMortemLesions";
import SampleReferral from "./components/FormSections/SampleReferral";
import emailjs from "@emailjs/browser";
import "./styles.css";

function FormApp() {
  const navigate = useNavigate();   // ✅ Navigation hook

  const [formData, setFormData] = useState({
    officerId: "",
    officerName: "",
    jobDescription: "",
    placeOfWork: "",
    contactNumber: "",
    dateReported: "",
    priorityDiseases: [],
    typeOfCase: "",
    numberOfCases: "",
    region: "",
    district: "",
    community: "",
    gpsLocation: "",
    sourceOfReport: "",
    otherSource: "",
    species: [],
    vaccinationStatus: "",
    ownership: "",
    onsetDate: "",
    caseClassification: "",
    clinicalSigns: [],
    labSampleType: "",
    labTest: "",
    labResult: "",
    postMortemLesions: [],
    sendToLab: "",
    sampleType: "",
    selectedLab: "",
    caseID: "",
  });

  const [readOnly, setReadOnly] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  /** Update any field */
  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /** Generate CaseID */
  const generateCaseID = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    const district = (formData.district || "UNK")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();

    const region = (formData.region || "REG")
      .replace(/\s+/g, "")
      .slice(0, 3)
      .toUpperCase();

    const key = `${region}-${district}-${dateStr}`;
    const prevCount = Number(localStorage.getItem(key) || 0);
    const newCount = prevCount + 1;

    localStorage.setItem(key, newCount.toString());

    return `${region}-${district}-${dateStr}-${String(newCount).padStart(3, "0")}`;
  };

  /** Load CaseID */
  const handleLoadCaseByID = (caseID) => {
    const storedCases = JSON.parse(localStorage.getItem("cases") || "{}");
    const caseData = storedCases[caseID];

    if (caseData) {
      setFormData(caseData);
      setReadOnly(true);
      alert(`✅ Case ${caseID} loaded successfully.`);
      setCurrentStep(1);
    } else {
      alert("❌ Case not found. Check the ID and try again.");
    }
  };

  /** Save case locally */
  const saveCase = (caseRecord) => {
    const storedCases = JSON.parse(localStorage.getItem("cases") || "{}");
    storedCases[caseRecord.caseID] = caseRecord;
    localStorage.setItem("cases", JSON.stringify(storedCases));
  };

  /** Required fields */
  const requiredFields = {
    intro: ["officerId", "officerName", "jobDescription", "placeOfWork", "contactNumber"],
    general: ["dateReported", "priorityDiseases", "typeOfCase", "numberOfCases", "region", "district"],
    animal: ["species", "vaccinationStatus", "ownership"],
    clinical: ["onsetDate", "caseClassification"],
  };

  /** Step validation */
  const validateStep = (stepId) => {
    if (stepId === "lab" && formData.placeOfWork !== "laboratory") return true;

    const fields = stepId === "lab"
      ? ["labSampleType", "labTest", "labResult"]
      : requiredFields[stepId] || [];

    for (const field of fields) {
      const value = formData[field];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (empty) {
        alert(`⚠️ Please fill in: ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }
    return true;
  };

  /** Send referral email — ALWAYS with CaseID */
  const sendReferralEmail = async (caseRecord) => {
    if (!caseRecord.sendToLab || caseRecord.sendToLab.toLowerCase() !== "yes") {
      return;
    }

    const labEmails = {
      "Takoradi Veterinary Lab": "oseibright172@gmail.com",
      "Kumasi Veterinary Lab": "owususekyeresmith@gmail.com",
      "Accra Veterinary Lab": "kutamemark@gmail.com",
      "Central Veterinary Lab Pong Tamale": "boatprince01@gmail.com",
    };

    const to_email = labEmails[caseRecord.selectedLab];
    if (!to_email) return;

    if (!caseRecord.caseID || caseRecord.caseID.trim() === "") {
      const newID = generateCaseID();
      caseRecord.caseID = newID;
      updateFormData("caseID", newID);
    }

    const payload = {
      to_email,
      case_id: caseRecord.caseID,
      case_type: caseRecord.typeOfCase,
      sample_type: caseRecord.sampleType,
      district: caseRecord.district,
      region: caseRecord.region,
      officer_name: caseRecord.officerName,
      contact_number: caseRecord.contactNumber,
      lab_name: caseRecord.selectedLab,
    };

    try {
      await emailjs.send(
        "service_b1tiwj6",
        "template_v4xu1qr",
        payload,
        "rLj4_afPujWyNgG-z"
      );
    } catch (err) {
      console.error("EmailJS Error:", err);
    }
  };

  /** Step components */
  const steps = [
    { id: "intro", label: "Introduction", component: <IntroAndOfficer formData={formData} updateFormData={updateFormData} handleLoadCaseByID={handleLoadCaseByID} readOnly={readOnly} /> },
    { id: "general", label: "General Case Info", component: <GeneralCase formData={formData} updateFormData={updateFormData} readOnly={readOnly} /> },
    { id: "animal", label: "Animal Information", component: <AnimalInfo formData={formData} updateFormData={updateFormData} readOnly={readOnly} /> },
    { id: "clinical", label: "Clinical & Classification", component: <ClinicalInfo formData={formData} updateFormData={updateFormData} readOnly={readOnly} /> },

    ...(formData.placeOfWork === "laboratory"
      ? [{ id: "lab", label: "Lab & Diagnostics", component: <LabDiagnostics formData={formData} updateFormData={updateFormData} readOnly={false} /> }]
      : []),

    { id: "control", label: "Control Measures", component: <ControlMeasures formData={formData} updateFormData={updateFormData} readOnly={readOnly} /> },

    ...(formData.placeOfWork !== "laboratory"
      ? [{ id: "referral", label: "Sample Referral", component: <SampleReferral formData={formData} updateFormData={updateFormData} /> }]
      : []),

    ...(formData.placeOfWork === "abattoir" || formData.placeOfWork === "laboratory"
      ? [{ id: "postmortem", label: "Post Mortem Lesions", component: <PostMortemLesions formData={formData} updateFormData={updateFormData} readOnly={readOnly} /> }]
      : []),
  ];

  /** Navigation */
  const goNext = () => {
    const stepId = steps[currentStep].id;
    if (!validateStep(stepId)) return;

    setCompletedSteps((prev) => [...new Set([...prev, stepId])]);
    if (currentStep + 1 < steps.length) setCurrentStep(currentStep + 1);
  };

  const goBack = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  /** FINAL SUBMIT */
  const handleSubmit = async () => {
    let caseID = formData.caseID;

    if (!caseID || caseID.trim() === "") {
      caseID = generateCaseID();
      updateFormData("caseID", caseID);
    }

    const caseRecord = { ...formData, caseID };

    saveCase(caseRecord);
    await sendReferralEmail(caseRecord);

    // 🚀 Redirect to success page
    navigate("/case-success", {
      state: {
        caseID,
        region: formData.region,
        district: formData.district,
      },
    });
  };

  return (
    <WizardLayout
      steps={steps}
      currentStep={currentStep}
      setStep={setCurrentStep}
      completedSteps={completedSteps}
    >
      <div>{steps[currentStep].component}</div>

      <div className="wizard-nav">
        {currentStep > 0 && <button onClick={goBack}>← Back</button>}
        {currentStep < steps.length - 1 && (
          <button onClick={goNext}>Next →</button>
        )}
        {currentStep === steps.length - 1 && (
          <button onClick={handleSubmit}>Submit Case</button>
        )}
      </div>
    </WizardLayout>
  );
}

export default FormApp;