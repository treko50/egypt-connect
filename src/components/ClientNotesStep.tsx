"use client"

import { useBookingFlow } from './BookingFlowProvider'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'

export function ClientNotesStep() {
  const { formData, updateFormData, setCurrentStep } = useBookingFlow()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Your Questions & Context</CardTitle>
          <CardDescription>
            Help the judge prepare for your consultation by sharing any questions, concerns, or
            background information about your case.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="client-notes" className="block text-sm font-medium text-gray-900">
              Your Notes
            </label>
            <Textarea
              id="client-notes"
              value={formData.clientNotes}
              onChange={(e) => updateFormData({ clientNotes: e.target.value })}
              placeholder="Example:&#10;&#10;- I need advice regarding a contract dispute with my landlord&#10;- The lease expires in 3 months&#10;- I have documentation of all communications&#10;&#10;Please add any specific questions or details about your situation..."
              rows={12}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {formData.clientNotes.length} characters
            </p>
          </div>

          {/* Helpful Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Tips for better consultations:</h4>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>List specific questions you want answered</li>
              <li>Provide relevant dates, locations, and parties involved</li>
              <li>Mention any deadlines or time-sensitive matters</li>
              <li>Reference uploaded documents if applicable</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          Back to Documents
        </Button>
        <Button onClick={() => setCurrentStep(4)}>
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
