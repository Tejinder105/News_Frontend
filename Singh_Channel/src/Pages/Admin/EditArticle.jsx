import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import CreateArticle from './CreateArticle';
import adminService from '../../Services/adminService';
import { Spinner } from '../../Components';

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const articleData = await adminService.getArticleForEdit(id, token);
        
        // Transform field names to match form expectations
        const transformedArticle = {
          ...articleData,
          is_featured: articleData.isfeatured,
          is_breaking: articleData.isBreaking,
          featured_image: articleData.image, // Map image field
        };
        
        console.log('Original article data:', articleData);
        console.log('Transformed article data:', transformedArticle);
        
        setArticle(transformedArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError(error.message || 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/allarticles')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The article you're trying to edit could not be found.</p>
          <button
            onClick={() => navigate('/admin/allarticles')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return <CreateArticle post={article} />;
}
