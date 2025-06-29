import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { idVerificationService, fileUploadService } from '../../lib/database';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface IDVerificationFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', country: 'India', requiresBack: false },
  { value: 'pan', label: 'PAN Card', country: 'India', requiresBack: false },
  { value: 'passport', label: 'Passport', country: 'International', requiresBack: false },
  { value: 'driving_license', label: 'Driving License', country: 'India', requiresBack: true },
  { value: 'voter_id', label: 'Voter ID Card', country: 'India', requiresBack: true },
  { value: 'national_id', label: 'National ID', country: 'International', requiresBack: true },
  { value: 'social_security', label: 'Social Security Card', country: 'USA', requiresBack: false },
  { value: 'tax_id', label: 'Tax ID', country: 'International', requiresBack: false },
  { value: 'work_permit', label: 'Work Permit', country: 'International', requiresBack: false },
  { value: 'student_id', label: 'Student ID', country: 'International', requiresBack: false }
];

export const IDVerificationForm: React.FC<IDVerificationFormProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    issuedBy: '',
    expiryDate: '',
    frontImage: null as File | null,
    backImage: null as File | null,
    selfieImage: null as File | null
  });

  const selectedIdType = ID_TYPES.find(type => type.value === formData.idType);

  const handleFileUpload = (type: 'front' | 'back' | 'selfie', file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [`${type}Image`]: file
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Upload images
      const frontImageUrl = await fileUploadService.uploadFile(
        'id-documents',
        `${user.id}/front-${Date.now()}.jpg`,
        formData.frontImage!
      );

      let backImageUrl = null;
      if (formData.backImage) {
        backImageUrl = await fileUploadService.uploadFile(
          'id-documents',
          `${user.id}/back-${Date.now()}.jpg`,
          formData.backImage
        );
      }

      const selfieUrl = await fileUploadService.uploadFile(
        'id-documents',
        `${user.id}/selfie-${Date.now()}.jpg`,
        formData.selfieImage!
      );

      // Submit verification
      await idVerificationService.submitVerification({
        user_id: user.id,
        id_type: formData.idType as any,
        id_number: formData.idNumber,
        id_document_front_url: frontImageUrl,
        id_document_back_url: backImageUrl,
        selfie_url: selfieUrl,
        issued_by: formData.issuedBy,
        expiry_date: formData.expiryDate || null
      });

      toast.success('ID verification submitted successfully!');
      onComplete();
    } catch (error) {
      console.error('Verification submission failed:', error);
      toast.error('Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select ID Type</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {ID_TYPES.map((idType) => (
            <motion.button
              key={idType.value}
              whileHover={{ scale: 1.02 }}
              onClick={() => setFormData(prev => ({ ...prev, idType: idType.value }))}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.idType === idType.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{idType.label}</div>
              <div className="text-sm text-gray-600">{idType.country}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number *
          </label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your ID number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issued By
          </label>
          <input
            type="text"
            value={formData.issuedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, issuedBy: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Issuing authority"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expiry Date (if applicable)
        </label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Document Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Clear, high-quality images</li>
                <li>All text must be readable</li>
                <li>No glare or shadows</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported formats: JPG, PNG</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedIdType?.label} - Front *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            {formData.frontImage ? (
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                <p className="text-sm text-gray-600">{formData.frontImage.name}</p>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, frontImage: null }))}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload front side</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('front', e.target.files[0])}
                  className="hidden"
                  id="front-upload"
                />
                <label
                  htmlFor="front-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Back Image (if required) */}
        {selectedIdType?.requiresBack && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedIdType?.label} - Back *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {formData.backImage ? (
                <div className="space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="text-sm text-gray-600">{formData.backImage.name}</p>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, backImage: null }))}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload back side</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('back', e.target.files[0])}
                    className="hidden"
                    id="back-upload"
                  />
                  <label
                    htmlFor="back-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Take a Selfie</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Camera className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Selfie Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Look directly at the camera</li>
                <li>Ensure good lighting</li>
                <li>Remove glasses and hat</li>
                <li>Keep a neutral expression</li>
                <li>Make sure your face is clearly visible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          {formData.selfieImage ? (
            <div className="space-y-4">
              <img
                src={URL.createObjectURL(formData.selfieImage)}
                alt="Selfie preview"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
              <p className="text-sm text-gray-600">{formData.selfieImage.name}</p>
              <button
                onClick={() => setFormData(prev => ({ ...prev, selfieImage: null }))}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Retake
              </button>
            </div>
          ) : (
            <div>
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Take a clear selfie</p>
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                className="hidden"
                id="selfie-upload"
              />
              <label
                htmlFor="selfie-upload"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Selfie
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.idType && formData.idNumber;
      case 2:
        return formData.frontImage && (!selectedIdType?.requiresBack || formData.backImage);
      case 3:
        return formData.selfieImage;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStep === 1 && 'ID Information'}
            {currentStep === 2 && 'Document Upload'}
            {currentStep === 3 && 'Identity Verification'}
          </h2>
          <p className="text-gray-600">
            Step {currentStep} of 3
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <div>
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Verification
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};