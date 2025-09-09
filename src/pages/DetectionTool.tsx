import React, { useState } from 'react';
import { Upload, Eye, User, Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PatientInfo {
  id: string;
  age: string;
  eye: 'left' | 'right' | '';
}

interface PredictionResult {
  class: string;
  confidence: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
  recommendation: string;
  description: string;
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
  mild: Eye,
  moderate: AlertTriangle,
  severe: AlertTriangle,
  proliferative: XCircle
};

const DetectionTool = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ id: '', age: '', eye: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const mockResults: PredictionResult[] = [
    {
      class: 'No Diabetic Retinopathy',
      confidence: 94.2,
      severity: 'none',
      recommendation: 'Continue regular eye examinations as recommended by your healthcare provider.',
      description: 'No signs of diabetic retinopathy detected in the retinal image.'
    },
    {
      class: 'Mild Diabetic Retinopathy',
      confidence: 87.5,
      severity: 'mild',
      recommendation: 'Schedule follow-up examination in 6-12 months. Continue diabetes management.',
      description: 'Early signs of diabetic retinopathy detected with minimal retinal changes.'
    },
    {
      class: 'Moderate Diabetic Retinopathy',
      confidence: 91.8,
      severity: 'moderate',
      recommendation: 'Schedule follow-up examination in 3-6 months. Optimize diabetes control.',
      description: 'Moderate diabetic changes present. Closer monitoring recommended.'
    },
    {
      class: 'Severe Diabetic Retinopathy',
      confidence: 89.3,
      severity: 'severe',
      recommendation: 'Urgent referral to retinal specialist within 1-2 weeks.',
      description: 'Severe diabetic retinopathy detected. Immediate medical attention required.'
    },
    {
      class: 'Proliferative Diabetic Retinopathy',
      confidence: 93.7,
      severity: 'proliferative',
      recommendation: 'URGENT: Immediate referral to retinal specialist for treatment.',
      description: 'Advanced diabetic retinopathy with new blood vessel formation detected.'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    } else {
      alert('Please upload a JPEG or PNG image file.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleAnalysis = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return random result for demo
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setResult(randomResult);
    setIsProcessing(false);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setImagePreview('');
    setResult(null);
    setPatientInfo({ id: '', age: '', eye: '' });
  };

  const SeverityIcon = result ? severityIcons[result.severity] : Eye;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Image Upload Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Upload className="mr-2 h-5 w-5 text-blue-600" />
                Upload Retinal Image
              </h2>
              <p className="text-sm text-gray-600 mt-1">Upload a high-quality fundus photograph (JPEG/PNG)</p>
            </div>
            
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded retinal image" 
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain"
                    />
                    <p className="text-sm text-gray-600">{uploadedImage?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload retinal image</p>
                      <p className="text-sm text-gray-600">Drag and drop or click to browse</p>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Patient Information Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Patient Information (Optional)
              </h2>
              <p className="text-sm text-gray-600 mt-1">Additional details for better tracking</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    type="text"
                    value={patientInfo.id}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eye</label>
                  <select
                    value={patientInfo.eye}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, eye: e.target.value as 'left' | 'right' | '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select eye</option>
                    <option value="left">Left Eye</option>
                    <option value="right">Right Eye</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAnalysis}
              disabled={!uploadedImage || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  <span>Analyze Retinal Image</span>
                </>
              )}
            </button>
            
            <button
              onClick={resetAnalysis}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Analysis Results
              </h2>
            </div>
            
            <div className="p-6">
              {isProcessing ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <div>
                    <p className="font-medium text-gray-900">Processing Image</p>
                    <p className="text-sm text-gray-600">AI analysis in progress...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Prediction Result */}
                  <div className={`p-4 rounded-lg border-2 ${severityColors[result.severity]}`}>
                    <div className="flex items-start space-x-3">
                      <SeverityIcon className="h-6 w-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{result.class}</h3>
                        <p className="text-sm opacity-90 mt-1">{result.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Confidence</span>
                      <span className="text-sm font-bold text-gray-900">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                      Recommendation
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation}</p>
                  </div>

                  {/* Patient Info Display */}
                  {(patientInfo.id || patientInfo.age || patientInfo.eye) && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Patient Details</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        {patientInfo.id && <p>ID: {patientInfo.id}</p>}
                        {patientInfo.age && <p>Age: {patientInfo.age} years</p>}
                        {patientInfo.eye && <p>Eye: {patientInfo.eye === 'left' ? 'Left' : 'Right'}</p>}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>Medical Disclaimer:</strong> This AI analysis is for screening purposes only. 
                      Always consult with a qualified ophthalmologist for proper medical diagnosis and treatment decisions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Upload an image to begin analysis</p>
                  <p className="text-sm">Results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionTool;