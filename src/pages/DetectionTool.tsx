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
      {/* Hero Banner with Medical Imagery */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        <img 
          src="https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=1200" 
          alt="Diabetic retinopathy fundus examination"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI-Powered Diabetic Retinopathy Detection
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              Upload a retinal fundus image for instant AI analysis. Our advanced machine learning 
              model helps detect early signs of diabetic retinopathy with high accuracy.
            </p>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm">FDA-Grade Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Instant Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">Early Detection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Image Upload Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>
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
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg object-contain border-2 border-gray-200"
                    />
                    <p className="text-sm text-gray-600">{uploadedImage?.name}</p>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Image uploaded successfully</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img 
                        src="https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400" 
                        alt="Fundus photography for diabetic retinopathy"
                        className="mx-auto h-24 w-24 rounded-full object-cover opacity-20"
                      />
                      <Upload className="absolute inset-0 mx-auto h-12 w-12 text-blue-500 top-6" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload retinal image</p>
                      <p className="text-sm text-gray-600">Drag and drop a fundus photograph or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG (Max 10MB)</p>
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
            <div className="h-2 bg-gradient-to-r from-teal-500 to-green-500"></div>
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
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
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
                  <div className="relative mb-4">
                    <img 
                      src="https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=300" 
                      alt="Diabetic retinopathy screening"
                      className="h-16 w-16 mx-auto rounded-full object-cover opacity-30"
                    />
                    <Eye className="absolute inset-0 h-8 w-8 mx-auto mt-4 opacity-50" />
                  </div>
                  <p className="font-medium">Upload an image to begin analysis</p>
                  <p className="text-sm">Results will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Information Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Diabetic retinopathy stages"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Diabetic Retinopathy</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Learn about the different stages of diabetic retinopathy and how early detection 
              can prevent vision loss and blindness.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Retinal imaging technology"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our advanced machine learning algorithms analyze retinal images with precision 
              comparable to specialist ophthalmologists.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/7659649/pexels-photo-7659649.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Ophthalmologist consultation"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Consultation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Always consult with qualified healthcare professionals for proper diagnosis 
              and treatment recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionTool;