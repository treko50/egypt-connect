"use client"

import { useState } from 'react'
import { useBookingFlow } from './BookingFlowProvider'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Upload, X, FileText } from 'lucide-react'

interface UploadedDocument {
  name: string
  type: string
  file_url: string
  file_size: number
  mime_type: string
  description?: string
}

export function DocumentUploadStep() {
  const { formData, updateFormData, setCurrentStep } = useBookingFlow()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // In a real app, this would upload to Supabase Storage or S3
      // For now, we'll simulate the upload
      const newDocuments: UploadedDocument[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Create a fake URL (in production, this would be the actual storage URL)
        const fakeUrl = `https://storage.example.com/${Date.now()}-${file.name}`

        newDocuments.push({
          name: file.name,
          type: 'general',
          file_url: fakeUrl,
          file_size: file.size,
          mime_type: file.type,
        })
      }

      updateFormData({
        documents: [...formData.documents, ...newDocuments],
      })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload documents. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index)
    updateFormData({ documents: newDocuments })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents (Optional)</CardTitle>
          <CardDescription>
            Upload any relevant documents for your consultation. You can add contracts, legal
            documents, or any other files that the judge should review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isUploading ? 'Uploading...' : 'Click to upload files'}
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOC, DOCX, JPG, PNG up to 10MB each
              </p>
            </label>
          </div>

          {/* Uploaded Documents List */}
          {formData.documents.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Uploaded Documents</h3>
              {formData.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-8 w-8 text-primary-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(doc.file_size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDocument(index)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove document"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can upload documents now or add them later before your
              appointment time. The judge will review all documents before your consultation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
        >
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)}>
          Continue to Notes
        </Button>
      </div>
    </div>
  )
}
