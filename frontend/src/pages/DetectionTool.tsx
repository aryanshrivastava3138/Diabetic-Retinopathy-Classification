@@ .. @@
 import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Upload, Eye, User, Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
+import { apiService, PredictionRequest } from '../services/api';

 interface PatientInfo {
@@ .. @@
   eye: 'left' | 'right' | '';
 }

-interface PredictionResult {
-  class: string;
-  confidence: number;
-  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
-  recommendation: string;
-  description: string;
-}
-
 const severityColors = {
   none: 'text-green-600 bg-green-50 border-green-200',
   mild: 'text-blue-600 bg-blue-50 border-blue-200',
@@ .. @@
   const [isProcessing, setIsProcessing] = useState(false);
   const [dragActive, setDragActive] = useState(false);
+  const [error, setError] = useState<string>('');

-  const mockResults: PredictionResult[] = [
-    {
-      class: 'No Diabetic Retinopathy',
-      confidence: 94.2,
-      severity: 'none',
-      recommendation: 'Continue regular eye examinations as recommended by your healthcare provider.',
-      description: 'No signs of diabetic retinopathy detected in the retinal image.'
-    },
-    {
-      class: 'Mild Diabetic Retinopathy',
-      confidence: 87.5,
-      severity: 'mild',
-      recommendation: 'Schedule follow-up examination in 6-12 months. Continue diabetes management.',
-      description: 'Early signs of diabetic retinopathy detected with minimal retinal changes.'
-    },
-    {
-      class: 'Moderate Diabetic Retinopathy',
-      confidence: 91.8,
-      severity: 'moderate',
-      recommendation: 'Schedule follow-up examination in 3-6 months. Optimize diabetes control.',
-      description: 'Moderate diabetic changes present. Closer monitoring recommended.'
-    },
-    {
-      class: 'Severe Diabetic Retinopathy',
-      confidence: 89.3,
-      severity: 'severe',
-      recommendation: 'Urgent referral to retinal specialist within 1-2 weeks.',
-      description: 'Severe diabetic retinopathy detected. Immediate medical attention required.'
-    },
-    {
-      class: 'Proliferative Diabetic Retinopathy',
-      confidence: 93.7,
-      severity: 'proliferative',
-      recommendation: 'URGENT: Immediate referral to retinal specialist for treatment.',
-      description: 'Advanced diabetic retinopathy with new blood vessel formation detected.'
-    }
-  ];
-
   const handleDrag = (e: React.DragEvent) => {
@@ .. @@
       setUploadedImage(file);
       const reader = new FileReader();
       reader.onload = (e) => {
         setImagePreview(e.target?.result as string);
       };
       reader.readAsDataURL(file);
-      setResult(null);
+      setError('');
     } else {
       alert('Please upload a JPEG or PNG image file.');
@@ .. @@
   const handleAnalysis = async () => {
     if (!uploadedImage) {
       alert('Please upload an image first.');
       return;
     }

     setIsProcessing(true);
+    setError('');
     
-    // Simulate AI processing time
-    await new Promise(resolve => setTimeout(resolve, 3000));
-    
-    // Return random result for demo
-    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
-    setIsProcessing(false);
-    
-    // Navigate to results page with data
-    navigate('/results', {
-      state: {
-        result: randomResult,
-        patientInfo: patientInfo,
-        imagePreview: imagePreview,
-        fileName: uploadedImage.name
-      }
-    });
+    try {
+      const requestData: PredictionRequest = {
+        image: imagePreview,
+        patientInfo: patientInfo
+      };
+
+      const response = await apiService.predict(requestData);
+      
+      if (response.success) {
+        // Navigate to results page with data
+        navigate('/results', {
+          state: {
+            result: response.prediction,
+            patientInfo: patientInfo,
+            imagePreview: imagePreview,
+            fileName: uploadedImage.name,
+            timestamp: response.timestamp,
+            modelAccuracy: response.model_accuracy
+          }
+        });
+      } else {
+        setError(response.error || 'Analysis failed');
+      }
+    } catch (err) {
+      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please check your connection and try again.');
+    } finally {
+      setIsProcessing(false);
+    }
   };

   const resetAnalysis = () => {
     setUploadedImage(null);
     setImagePreview('');
     setPatientInfo({ id: '', age: '', eye: '' });
+    setError('');
   };

@@ .. @@
           </div>

+          {/* Error Display */}
+          {error && (
+            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
+              <div className="flex items-center space-x-2">
+                <XCircle className="h-5 w-5 text-red-600" />
+                <p className="text-red-800 font-medium">Analysis Error</p>
+              </div>
+              <p className="text-red-700 text-sm mt-1">{error}</p>
+            </div>
+          )}
+
           {/* Action Buttons */}
           <div className="flex space-x-4">
@@ .. @@
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                   <div>
                     <p className="font-medium text-gray-900">Analyzing Image</p>
-                    <p className="text-sm text-gray-600">AI analysis in progress...</p>
+                    <p className="text-sm text-gray-600">CNN model processing (94% accuracy)...</p>
                     <p className="text-xs text-gray-500 mt-2">Results will open in a new page</p>
                   </div>
                 </div>
@@ .. @@
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
-                  <p className="text-sm">Results will open in a separate page</p>
+                  <p className="text-sm">CNN model with 94% accuracy</p>
                 </div>
               </div>
             </div>
@@ .. @@
             <p className="text-gray-600 text-sm leading-relaxed">
               Our advanced machine learning algorithms analyze retinal images with precision 
-              comparable to specialist ophthalmologists.
+              comparable to specialist ophthalmologists. CNN model trained with 94% accuracy.
             </p>
           </div>
         </div>