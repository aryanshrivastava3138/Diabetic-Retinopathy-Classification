@@ .. @@
 interface LocationState {
   result: PredictionResult;
   patientInfo: PatientInfo;
   imagePreview: string;
   fileName: string;
+  timestamp?: string;
+  modelAccuracy?: number;
 }

@@ .. @@
     return null;
   }

-  const { result, patientInfo, imagePreview, fileName } = state;
+  const { result, patientInfo, imagePreview, fileName, timestamp, modelAccuracy } = state;
   const SeverityIcon = severityIcons[result.severity];
-  const currentDate = new Date().toLocaleDateString();
-  const currentTime = new Date().toLocaleTimeString();
+  const analysisDate = timestamp ? new Date(timestamp) : new Date();
+  const currentDate = analysisDate.toLocaleDateString();
+  const currentTime = analysisDate.toLocaleTimeString();

@@ .. @@
 ANALYSIS RESULTS:
 Classification: ${result.class}
 Confidence Level: ${result.confidence}%
 Severity: ${result.severity.toUpperCase()}
+${modelAccuracy ? `Model Accuracy: ${modelAccuracy}%` : ''}

 DESCRIPTION:
@@ .. @@
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Analysis Method:</span>
-                        <span className="font-medium text-gray-900">AI Deep Learning</span>
+                        <span className="font-medium text-gray-900">CNN Model</span>
+                      </div>
+                      {modelAccuracy && (
+                        <div className="flex justify-between">
+                          <span className="text-gray-600">Model Accuracy:</span>
+                          <span className="font-medium text-gray-900">{modelAccuracy}%</span>
+                        </div>
+                      )}
                     </div>
                   </div>