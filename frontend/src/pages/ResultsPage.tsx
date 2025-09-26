import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, User, FileText, AlertTriangle, CheckCircle, AlertCircle, XCircle, Activity } from 'lucide-react';

interface PredictionResult {
  class: string;
  confidence: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
  description: string;
  recommendation: string;
  urgency: 'routine' | 'moderate' | 'urgent' | 'emergency';
}

interface PatientInfo {
  id: string;
  age: string;
  eye: 'left' | 'right' | '';
}

interface LocationState {
  result: PredictionResult;
  patientInfo: PatientInfo;
  imagePreview: string;
  fileName: string;
  timestamp?: string;
  modelAccuracy?: number;
}

const severityColors = {
  none: 'text-green-600 bg-green-50 border-green-200',
  mild: 'text-blue-600 bg-blue-50 border-blue-200',
  moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  severe: 'text-orange-600 bg-orange-50 border-orange-200',
  proliferative: 'text-red-600 bg-red-50 border-red-200'
};

const severityIcons = {
  none: CheckCircle,
  mild: AlertCircle,
  moderate: AlertTriangle,
  severe: AlertTriangle,
  proliferative: XCircle
};

const urgencyColors = {
  routine: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  urgent: 'bg-orange-100 text-orange-800',
  emergency: 'bg-red-100 text-red-800'
};

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please upload an image for analysis first.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Detection Tool
          </button>
        </div>
      </div>
    );
  }

  const { result, patientInfo, imagePreview, fileName, timestamp, modelAccuracy } = state;
  const SeverityIcon = severityIcons[result.severity];
  const analysisDate = timestamp ? new Date(timestamp) : new Date();
  const currentDate = analysisDate.toLocaleDateString();
  const currentTime = analysisDate.toLocaleTimeString();

  const downloadReport = () => {
    const reportContent = `
DIABETIC RETINOPATHY ANALYSIS REPORT
=====================================

PATIENT INFORMATION:
Patient ID: ${patientInfo.id || 'Not provided'}
Age: ${patientInfo.age || 'Not provided'}
Eye: ${patientInfo.eye ? patientInfo.eye.charAt(0).toUpperCase() + patientInfo.eye.slice(1) : 'Not specified'}

ANALYSIS DETAILS:
Date: ${currentDate}
Time: ${currentTime}
Image File: ${fileName}

ANALYSIS RESULTS:
Classification: ${result.class}
Confidence Level: ${result.confidence}%
Severity: ${result.severity.toUpperCase()}
${modelAccuracy ? `Model Accuracy: ${modelAccuracy}%` : ''}

DESCRIPTION:
${result.description}

RECOMMENDATION:
${result.recommendation}

URGENCY LEVEL: ${result.urgency.toUpperCase()}

=====================================
IMPORTANT DISCLAIMER:
This analysis is for screening purposes only and should not replace professional medical diagnosis. Please consult with a qualified healthcare provider for proper medical evaluation and treatment.
=====================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DR_Analysis_Report_${patientInfo.id || 'Patient'}_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Detection Tool
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <button
            onClick={downloadReport}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Uploaded Image */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Retinal Image
              </h2>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Analyzed retinal image"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {fileName}
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient ID:</span>
                  <span className="font-medium text-gray-900">{patientInfo.id || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium text-gray-900">{patientInfo.age || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eye:</span>
                  <span className="font-medium text-gray-900">
                    {patientInfo.eye ? patientInfo.eye.charAt(0).toUpperCase() + patientInfo.eye.slice(1) : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Analysis Date:</span>
                  <span className="font-medium text-gray-900">{currentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Analysis Time:</span>
                  <span className="font-medium text-gray-900">{currentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Analysis Method:</span>
                  <span className="font-medium text-gray-900">CNN Model</span>
                </div>
                {modelAccuracy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model Accuracy:</span>
                    <span className="font-medium text-gray-900">{modelAccuracy}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Diagnosis Result
              </h2>
              
              <div className={`border-2 rounded-lg p-4 mb-4 ${severityColors[result.severity]}`}>
                <div className="flex items-center mb-2">
                  <SeverityIcon className="h-6 w-6 mr-2" />
                  <span className="text-lg font-bold">{result.class.replace('_', ' ')}</span>
                </div>
                <div className="text-sm opacity-90">
                  Confidence: {result.confidence}%
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Severity Level</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${severityColors[result.severity]}`}>
                    {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Urgency</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${urgencyColors[result.urgency]}`}>
                    {result.urgency.charAt(0).toUpperCase() + result.urgency.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Medical Recommendations
              </h2>
              <div className={`border-l-4 pl-4 py-2 ${
                result.urgency === 'emergency' ? 'border-red-500 bg-red-50' :
                result.urgency === 'urgent' ? 'border-orange-500 bg-orange-50' :
                result.urgency === 'moderate' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <p className="text-gray-800 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Important Medical Disclaimer
              </h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                This AI analysis is for screening purposes only and should not replace professional 
                medical diagnosis. Please consult with a qualified ophthalmologist or healthcare 
                provider for proper medical evaluation, diagnosis, and treatment recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Analyze Another Image
          </button>
          <button
            onClick={downloadReport}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;