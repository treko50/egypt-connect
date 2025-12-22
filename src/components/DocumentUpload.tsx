"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, Check, AlertCircle, FileText, Image as ImageIcon, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: 'client' | 'provider'
  status: 'uploading' | 'completed' | 'failed'
  progress?: number
  url?: string
}

export interface DocumentUploadProps {
  userRole: 'client' | 'provider'
  onUpload?: (files: File[]) => Promise<void>
  onDelete?: (fileId: string) => Promise<void>
  onDownload?: (fileId: string) => Promise<void>
  existingFiles?: UploadedFile[]
  maxFileSize?: number
  allowedTypes?: string[]
}

export function DocumentUpload({
  userRole,
  onUpload,
  onDelete,
  onDownload,
  existingFiles = [],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />
    if (type.includes('image')) return <ImageIcon className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxFileSize)}`
    }
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }
    return null
  }, [maxFileSize, allowedTypes])

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    setError(null)
    const filesToUpload: File[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      filesToUpload.push(file)

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}_${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: userRole,
        status: 'uploading',
        progress: 0,
      }

      setFiles(prev => [...prev, uploadedFile])
    }

    if (onUpload && filesToUpload.length > 0) {
      try {
        await onUpload(filesToUpload)

        setFiles(prev => prev.map(f => ({
          ...f,
          status: 'completed' as const,
          progress: 100,
        })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        setFiles(prev => prev.map(f => ({
          ...f,
          status: 'failed' as const,
        })))
      }
    }
  }, [userRole, onUpload, validateFile])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleDelete = async (fileId: string) => {
    if (onDelete) {
      await onDelete(fileId)
    }
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleDownload = async (fileId: string) => {
    if (onDownload) {
      await onDownload(fileId)
    }
  }

  const clientFiles = files.filter(f => f.uploadedBy === 'client')
  const providerFiles = files.filter(f => f.uploadedBy === 'provider')

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Max file size: {formatFileSize(maxFileSize)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer",
              isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className={cn(
              "h-12 w-12 mx-auto mb-4",
              isDragging ? "text-primary-500" : "text-gray-400"
            )} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, JPG, PNG, DOC, DOCX
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Documents */}
      {clientFiles.length > 0 && (
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Client Documents
                <Badge variant="secondary">{clientFiles.length}</Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 text-primary-600">
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                    </div>

                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${file.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <div className="flex-shrink-0 text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                    )}

                    {file.status === 'failed' && (
                      <div className="flex-shrink-0 text-red-500">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    )}

                    {file.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}

                    {userRole === file.uploadedBy && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Documents */}
      {providerFiles.length > 0 && (
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Provider Documents
                <Badge variant="secondary">{providerFiles.length}</Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {providerFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 text-secondary-600">
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <div className="flex-shrink-0 text-green-500">
                        <Check className="h-5 w-5" />
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {userRole === file.uploadedBy && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
