'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import useNoteStore from '@/app/hooks/useNoteStore';
import useAIStore from '@/app/hooks/useAIStore';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Card from '@/app/components/ui/Card';
import FileUpload from '@/app/components/ui/FileUpload';

type NoteFormData = {
  title: string;
  content: string;
  subject: string;
  tags: string;
};

export default function NewNotePage() {
  const router = useRouter();
  const { createNote } = useNoteStore();
  const { extractPdfText } = useAIStore();
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    
    // If it's a PDF, try to extract text
    if (selectedFile.type === 'application/pdf') {
      setIsExtracting(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const result = await extractPdfText(formData);
        if (result && result.text) {
          setExtractedText(result.text);
          setValue('content', result.text);
          toast.success('Text extracted from PDF');
        }
      } catch (err) {
        console.error('Error extracting text:', err);
        toast.error('Failed to extract text from PDF');
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const onSubmit = async (data: NoteFormData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('subject', data.subject);
      
      // Convert comma-separated tags to array
      const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));
      
      if (file) {
        formData.append('file', file);
      }
      
      const newNote = await createNote(formData);
      toast.success('Note created successfully!');
      router.push(`/notes/${newNote._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create note. Please try again.');
      toast.error('Failed to create note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link href="/notes" className="mr-4">
          <Button variant="outline" size="sm" icon={<FiArrowLeft />}>
            Back to Notes
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
      </div>

      <Card className="mb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Title"
              type="text"
              fullWidth
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...register('subject', {
                required: 'Subject is required',
              })}
            >
              <option value="">Select a subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="History">History</option>
              <option value="Literature">Literature</option>
              <option value="Economics">Economics</option>
              <option value="Psychology">Psychology</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Tags (comma-separated)"
              type="text"
              placeholder="e.g. important, exam, chapter1"
              fullWidth
              error={errors.tags?.message}
              {...register('tags')}
            />
          </div>

          <div>
            <FileUpload
              onFileSelect={handleFileSelect}
              label="Upload File (Optional)"
              acceptedFileTypes="image/*,application/pdf,text/plain"
            />
            {isExtracting && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                Extracting text from PDF...
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              rows={12}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter your note content here..."
              {...register('content', {
                required: 'Content is required',
              })}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Link href="/notes">
              <Button type="button" variant="outline" icon={<FiX />}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={<FiSave />}
            >
              Save Note
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}