import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { bulkUploadQuestionsAsJson } from '../../services/questionService';

const BulkQuestionUpload = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [template, setTemplate] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    // Check file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setError('Please upload a CSV or Excel file');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Parse file on client side
      let questions = [];
      
      if (fileExtension === 'csv') {
        // Parse CSV
        questions = await parseCSV(file);
      } else {
        // Parse Excel
        questions = await parseExcel(file);
      }
      
      // Validate questions basic structure
      if (!questions || questions.length === 0) {
        throw new Error('No valid questions found in file');
      }
      
      // Send parsed data to server
      const result = await bulkUploadQuestionsAsJson(quizId, questions);
      
      setSuccess(`Successfully uploaded ${result.successCount} questions.`);
      if (result.errorCount > 0) {
        setError(`Failed to upload ${result.errorCount} questions due to formatting issues.`);
      }
      
      // Clear file input
      setFile(null);
      const fileInput = document.getElementById('question-file');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err.message || 'Failed to upload questions');
    } finally {
      setLoading(false);
    }
  };

  // Parse CSV file
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          } else {
            resolve(results.data);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  // Parse Excel file
  const parseExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const downloadTemplate = () => {
    // Create sample template with appropriate columns
    const csvContent = `questionText,questionType,option1,option1Correct,option2,option2Correct,option3,option3Correct,option4,option4Correct,points
"What is the capital of France?",multiple-choice,"Paris",TRUE,"London",FALSE,"Berlin",FALSE,"Madrid",FALSE,1
"The Earth is flat.",true-false,"True",FALSE,"False",TRUE,,,,,,1`;
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'question_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTemplate(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bulk Upload Questions</h1>
        <button
          onClick={() => navigate(`/lecturer/quizzes/${quizId}`)}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Quiz
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-600 mb-4">
            Upload a CSV or Excel file containing multiple questions to add them all at once.
            The file should have the following columns:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4 overflow-x-auto">
            <code className="text-sm">
              questionText, questionType, option1, option1Correct, option2, option2Correct, option3, option3Correct, option4, option4Correct, points
            </code>
          </div>
          
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
            <li><strong>questionText</strong>: The text of your question</li>
            <li><strong>questionType</strong>: Either "multiple-choice" or "true-false"</li>
            <li><strong>option1, option2, etc.</strong>: The text for each option</li>
            <li><strong>option1Correct, option2Correct, etc.</strong>: TRUE or FALSE to indicate if the option is correct</li>
            <li><strong>points</strong>: The point value for the question (default is 1)</li>
          </ul>
          
          <button
            onClick={downloadTemplate}
            className="text-blue-500 hover:text-blue-700"
          >
            Download Sample Template
          </button>
          {template && (
            <p className="text-green-600 text-sm mt-1">Template downloaded successfully!</p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question-file" className="block text-gray-700 font-medium mb-2">
              Upload Questions File
            </label>
            <input
              type="file"
              id="question-file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: CSV, XLSX, XLS
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Upload Questions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkQuestionUpload;