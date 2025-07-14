'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiSearch, FiFilter, FiFileText, FiImage, FiFile } from 'react-icons/fi';
import useNoteStore from '@/app/hooks/useNoteStore';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import { Note } from '@/app/types';
import { format } from 'date-fns';

export default function NotesPage() {
  const { notes, subjects, fetchNotes, fetchSubjects } = useNoteStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchNotes(), fetchSubjects()]);
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [fetchNotes, fetchSubjects]);

  useEffect(() => {
    let filtered = [...notes];
    
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }
    
    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedSubject]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return null;
    
    switch (fileType) {
      case 'pdf':
        return <FiFileText className="text-red-500" />;
      case 'image':
        return <FiImage className="text-blue-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Notes</h1>
        <Link href="/notes/new">
          <Button icon={<FiPlus />}>Add New Note</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
                fullWidth
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Link href={`/notes/${note._id}`} key={note._id}>
              <Card
                hoverable
                className="h-full border border-gray-200 hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
                      {note.title}
                    </h3>
                    {note.fileType && (
                      <div className="ml-2 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(note.fileType)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                    {note.summary || note.content.substring(0, 150)}...
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {note.subject}
                      </span>
                      {note.tags && note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          
          <Link href="/notes/new">
            <Card
              hoverable
              className="h-full border border-dashed border-gray-300 hover:border-indigo-300 transition-all"
            >
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <FiPlus className="text-indigo-600" size={24} />
                </div>
                <p className="text-indigo-600 font-medium">Add New Note</p>
              </div>
            </Card>
          </Link>
        </div>
      ) : (
        <Card className="border border-gray-200 bg-gray-50">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <FiFileText className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSubject
                ? "No notes match your search criteria"
                : "You don't have any notes yet"}
            </p>
            <Link href="/notes/new">
              <Button icon={<FiPlus />}>Create Your First Note</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}