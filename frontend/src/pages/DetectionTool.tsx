import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, User, Calendar, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { apiService, PredictionRequest } from '../services/api';

interface PatientInfo {
  id: string;
  age: string;
  eye: 'left' | 'right' | '';
}

const severityColors = {
  none: 'text-green-600 bg-green-50 border-green-200',
  mild: 'text-blue-600 bg-blue-50 border-blue-200',
  moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  severe: 'text-orange-600 bg-orange-50 border-orange-200',
  proliferative: 'text-red-600 bg-red-50 border-red-200'
};

const DetectionTool: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ id: '', age: '', eye: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    } else {
      alert('Please upload a JPEG or PNG image file.');
    }
  };

  const handleAnalysis = async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const requestData: PredictionRequest = {
        image: imagePreview,
        patientInfo: patientInfo
      };

      const response = await apiService.predict(requestData);
      
      if (response.success) {
        // Navigate to results page with data
        navigate('/results', {
          state: {
            result: response.prediction,
            patientInfo: patientInfo,
            imagePreview: imagePreview,
            fileName: uploadedImage.name,
            timestamp: response.timestamp,
            modelAccuracy: response.model_accuracy
          }
        });
      } else {
        setError(response.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setImagePreview('');
    setPatientInfo({ id: '', age: '', eye: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diabetic Retinopathy Screening
          </h1>
          <p className="text-gray-600">
            Upload a retinal image for AI-powered analysis
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Patient Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientInfo.id}
                  onChange={(e) => setPatientInfo({...patientInfo, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eye
                </label>
                <select
                  value={patientInfo.eye}
                  onChange={(e) => setPatientInfo({...patientInfo, eye: e.target.value as 'left' | 'right' | ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select eye</option>
                  <option value="left">Left Eye</option>
                  <option value="right">Right Eye</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Retinal Image
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{uploadedImage?.name}</p>
                    <p>{uploadedImage && (uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="relative mb-4">
                    <img 
                      src="/images/retinal-examination-1.jpg" 
                      alt="Diabetic retinopathy screening"
                      className="h-16 w-16 mx-auto rounded-full object-cover opacity-30"
                    />
                    <Eye className="absolute inset-0 h-8 w-8 mx-auto mt-4 opacity-50" />
                  </div>
                  <p className="font-medium">Upload an image to begin analysis</p>
                  <p className="text-sm">CNN model with 94% accuracy</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPEG, PNG (Max 10MB)
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">Analysis Error</p>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAnalysis}
              disabled={!uploadedImage || isProcessing}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Analyze Image
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

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <div>
                  <p className="font-medium text-gray-900">Analyzing Image</p>
                  <p className="text-sm text-gray-600">CNN model processing (94% accuracy)...</p>
                  <p className="text-xs text-gray-500 mt-2">Results will open in a new page</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
            </div>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>• Ensure high-quality, well-lit retinal images</li>
              <li>• This tool is for screening purposes only</li>
              <li>• Always consult with a healthcare professional</li>
              <li>• Results should not replace clinical judgment</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">AI Technology</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our advanced machine learning algorithms analyze retinal images with precision 
              comparable to specialist ophthalmologists. CNN model trained with 94% accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionTool;