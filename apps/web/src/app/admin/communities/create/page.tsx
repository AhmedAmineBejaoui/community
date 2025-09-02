'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createCommunitySchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  slug: z.string().min(3, 'Le slug doit contenir au moins 3 caractères').max(30, 'Le slug ne peut pas dépasser 30 caractères').regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères').max(500, 'La description ne peut pas dépasser 500 caractères'),
  joinPolicy: z.enum(['INVITE_ONLY', 'REQUEST_APPROVAL', 'CODE']),
  inviteCode: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowPosts: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowPolls: z.boolean().default(true),
  allowServices: z.boolean().default(true),
  allowMarketplace: z.boolean().default(true),
});

type CreateCommunityForm = z.infer<typeof createCommunitySchema>;

export default function CreateCommunityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<CreateCommunityForm>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      joinPolicy: 'INVITE_ONLY',
      isPublic: true,
      allowPosts: true,
      allowComments: true,
      allowPolls: true,
      allowServices: true,
      allowMarketplace: true,
    },
  });

  const watchJoinPolicy = watch('joinPolicy');
  const watchName = watch('name');

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name.length >= 3) {
      const slug = generateSlug(name);
      setValue('slug', slug);
    }
  };

  const onSubmit = async (data: CreateCommunityForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Communauté créée avec succès !');
        setTimeout(() => {
          router.push(`/admin/communities/${result.community.id}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la création de la communauté');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Créer une communauté</h1>
            </div>
            <div className="text-sm text-gray-500">
              Étape 1 sur 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Informations de base</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Permissions</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Finalisation</span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-xl font-semibold text-white">Informations de la communauté</h2>
            <p className="text-blue-100 mt-1">Remplissez les informations de base pour créer votre communauté</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Informations de base
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Community Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la communauté *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="name"
                      onChange={handleNameChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Quartier des Champs-Élysées"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Community Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                      Identifiant unique (slug) *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                        localhost:3000/c/
                      </span>
                      <input
                        {...register('slug')}
                        type="text"
                        id="slug"
                        className={`w-full pl-32 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.slug ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="exemple-communauté"
                      />
                    </div>
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      L'identifiant sera utilisé dans l'URL de votre communauté
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description de la communauté *
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez votre communauté, ses objectifs, ses valeurs..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {watch('description')?.length || 0}/500 caractères
                  </p>
                </div>
              </div>

              {/* Join Policy Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Politique d'adhésion
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none">
                      <input
                        type="radio"
                        {...register('joinPolicy')}
                        value="INVITE_ONLY"
                        className="sr-only"
                      />
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">Invitation uniquement</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Seuls les membres invités peuvent rejoindre
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                        watchJoinPolicy === 'INVITE_ONLY' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {watchJoinPolicy === 'INVITE_ONLY' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                    </label>

                    <label className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none">
                      <input
                        type="radio"
                        {...register('joinPolicy')}
                        value="REQUEST_APPROVAL"
                        className="sr-only"
                      />
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">Demande d'approbation</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Les demandes doivent être approuvées
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                        watchJoinPolicy === 'REQUEST_APPROVAL' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {watchJoinPolicy === 'REQUEST_APPROVAL' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                    </label>

                    <label className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none">
                      <input
                        type="radio"
                        {...register('joinPolicy')}
                        value="CODE"
                        className="sr-only"
                      />
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">Code d'invitation</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Rejoindre avec un code secret
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                        watchJoinPolicy === 'CODE' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {watchJoinPolicy === 'CODE' && (
                          <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Invite Code (conditional) */}
                  {watchJoinPolicy === 'CODE' && (
                    <div className="mt-4">
                      <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Code d'invitation
                      </label>
                      <input
                        {...register('inviteCode')}
                        type="text"
                        id="inviteCode"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: WELCOME2024"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Les utilisateurs devront entrer ce code pour rejoindre la communauté
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fonctionnalités activées
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'allowPosts', label: 'Publications', description: 'Permettre aux membres de créer des posts' },
                    { key: 'allowComments', label: 'Commentaires', description: 'Permettre les commentaires sur les posts' },
                    { key: 'allowPolls', label: 'Sondages', description: 'Créer et voter sur des sondages' },
                    { key: 'allowServices', label: 'Services', description: 'Demander et offrir des services' },
                    { key: 'allowMarketplace', label: 'Marketplace', description: 'Vendre et acheter des objets' },
                  ].map((feature) => (
                    <label key={feature.key} className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none">
                      <input
                        type="checkbox"
                        {...register(feature.key as keyof CreateCommunityForm)}
                        className="sr-only"
                      />
                      <div className="flex flex-1">
                        <div className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">{feature.label}</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            {feature.description}
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 flex h-5 w-5 items-center justify-center rounded-lg border ${
                        watch(feature.key as keyof CreateCommunityForm) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {watch(feature.key as keyof CreateCommunityForm) && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </Link>

              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isValid && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Créer la communauté
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Conseils pour créer une communauté réussie</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Choisissez un nom clair et mémorable</li>
                  <li>Rédigez une description détaillée de vos objectifs</li>
                  <li>Définissez une politique d'adhésion appropriée</li>
                  <li>Activez uniquement les fonctionnalités nécessaires</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
