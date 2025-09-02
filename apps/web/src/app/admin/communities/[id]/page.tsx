'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Lock,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  Copy,
  CalendarClock,
  Shield,
  Check,
} from 'lucide-react'

// UI kit minimal (compatible avec les imports shadcn du projet)
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
interface Community {
  id: string
  name: string
  slug: string
  description: string
  joinPolicy: 'INVITE_ONLY' | 'REQUEST_APPROVAL' | 'CODE' | string
  inviteCode?: string
  createdAt: string
  extra?: {
    isPublic: boolean
    allowPosts: boolean
    allowComments: boolean
    allowPolls: boolean
    allowServices: boolean
    allowMarketplace: boolean
  }
}

// ────────────────────────────────────────────────────────────
// Little helpers
// ────────────────────────────────────────────────────────────
const PolicyBadge = ({ policy }: { policy: Community['joinPolicy'] }) => {
  const label =
    policy === 'INVITE_ONLY'
      ? 'Invitation uniquement'
      : policy === 'REQUEST_APPROVAL'
      ? "Demande d'approbation"
      : policy === 'CODE'
      ? "Code d'invitation"
      : policy

  return (
    <Badge
      variant="secondary"
      className="gap-2 border border-blue-300/50 bg-blue-50 text-blue-700"
    >
      <Shield className="h-3.5 w-3.5" /> {label}
    </Badge>
  )
}

const FeatureChip = ({ enabled, label, desc }: { enabled: boolean; label: string; desc: string }) => (
  <Card className="relative overflow-hidden border border-white/20 bg-gradient-to-br from-white/60 to-white/20 backdrop-blur supports-[backdrop-filter]:bg-white/10">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      {enabled ? (
        <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white">Activé</Badge>
      ) : (
        <Badge variant="secondary" className="bg-rose-100 text-rose-700">Désactivé</Badge>
      )}
    </CardContent>
  </Card>
)

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium text-gray-600 mb-2">{children}</div>
)

// Shimmer skeletons for loading state
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`} />
)

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────
export default function CommunityDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [community, setCommunity] = useState<Community | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [saving, setSaving] = useState(false)
  const [opError, setOpError] = useState('')
  const [opSuccess, setOpSuccess] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [copyOk, setCopyOk] = useState(false)

  // Fetch community
  useEffect(() => {
    const fetchCommunity = async () => {
      setIsLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/admin/communities/${id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Erreur lors du chargement de la communauté')
        const data = await res.json()
        setCommunity(data.community as Community)
      } catch (e: any) {
        setError(e?.message || 'Erreur de connexion')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchCommunity()
  }, [id])

  // Sync editable fields
  useEffect(() => {
    if (!community) return
    setEditName(community.name || '')
    setEditDescription(community.description || '')
  }, [community])

  const isDirty = useMemo(() => {
    if (!community) return false
    return (
      editName.trim() !== (community.name || '').trim() ||
      editDescription.trim() !== (community.description || '').trim()
    )
  }, [community, editName, editDescription])

  const createdAtDisplay = useMemo(() => {
    if (!community?.createdAt) return ''
    try {
      return new Date(community.createdAt).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return community.createdAt
    }
  }, [community?.createdAt])

  const onSave = async () => {
    if (!community) return
    setSaving(true)
    setOpError('')
    setOpSuccess('')
    try {
      const res = await fetch(`/api/admin/communities/${community.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDescription }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error || 'Échec de la mise à jour')
      }
      const j = await res.json()
      setCommunity(j.community as Community)
      setOpSuccess('Enregistré avec succès')
    } catch (e: any) {
      setOpError(e?.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!community) return
    setOpError('')
    setOpSuccess('')
    try {
      const res = await fetch(`/api/admin/communities/${community.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error || 'Échec de la suppression')
      }
      router.push('/admin')
    } catch (e: any) {
      setOpError(e?.message || 'Échec de la suppression')
    } finally {
      setDeleteOpen(false)
    }
  }

  const copyInvite = async () => {
    if (!community?.inviteCode) return
    try {
      await navigator.clipboard.writeText(community.inviteCode)
      setCopyOk(true)
      setTimeout(() => setCopyOk(false), 1500)
    } catch {}
  }

  // ────────────────────────────────────────────────────────────
  // Render — Loading & Error
  // ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50">
        <BackdropDecor />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 text-gray-700">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <Skeleton className="h-8 w-64 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full md:col-span-2" />
                <Skeleton className="h-10 w-40" />
              </div>
            </Card>
            <Card className="p-6">
              <Skeleton className="h-8 w-56 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-6 w-48" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <BackdropDecor />
        <div className="max-w-xl mx-auto px-4 py-24">
          <Card className="border-rose-200/40 bg-white/70 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <Shield className="h-5 w-5" /> Erreur
              </CardTitle>
              <CardDescription>Un problème est survenu lors du chargement de la communauté.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTitle>Échec du chargement</AlertTitle>
                <AlertDescription>{error || 'Communauté non trouvée'}</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/admin" className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Retour à l'admin
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // Render — Ready
  // ────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.15),transparent),radial-gradient(1000px_500px_at_100%_0%,rgba(236,72,153,0.15),transparent)]">
        <BackdropDecor />

        {/* Header */}
        <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b border-white/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                  <Link href="/admin" aria-label="Retour">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <motion.h1
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-xl font-semibold tracking-tight flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5 text-indigo-600" /> Détails de la communauté
                </motion.h1>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="secondary" className="gap-2">
                  <Link href={`/c/${community.slug}`}>
                    <ExternalLink className="h-4 w-4" /> Voir la communauté
                  </Link>
                </Button>
                <Button asChild className="gap-2">
                  <Link href="/admin/communities/create">
                    <Sparkles className="h-4 w-4" /> Créer une autre
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          {isDirty && (
            <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 animate-[pulse_2s_ease-in-out_infinite]" />
          )}
        </div>

        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Management Card */}
            <Card className="lg:col-span-2 border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-fuchsia-600" /> Gestion de la communauté
                </CardTitle>
                <CardDescription>
                  Modifiez le nom et la description. Les autres paramètres s'affichent ci‑dessous.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {opError && (
                  <Alert variant="destructive">
                    <AlertTitle>Action impossible</AlertTitle>
                    <AlertDescription>{opError}</AlertDescription>
                  </Alert>
                )}
                {opSuccess && (
                  <Alert className="border-emerald-200 text-emerald-800">
                    <AlertTitle>Succès</AlertTitle>
                    <AlertDescription>{opSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Nom</FieldLabel>
                    <Input
                      value={editName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                      placeholder="Nom de la communauté"
                    />
                  </div>
                  <div>
                    <FieldLabel>Slug</FieldLabel>
                    <Input value={community.slug} disabled />
                  </div>
                </div>

                <div>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
                    placeholder="Décrivez votre communauté"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  Créé le <span className="font-medium">{createdAtDisplay}</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button onClick={onSave} disabled={!isDirty || saving} className="gap-2">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {saving ? 'Sauvegarde…' : 'Enregistrer'}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {!isDirty && <TooltipContent>Aucun changement à enregistrer</TooltipContent>}
                  </Tooltip>
                </div>
              </CardFooter>
            </Card>

            {/* Quick Info Card */}
            <Card className="border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" /> Informations
                </CardTitle>
                <CardDescription>Données essentielles de la communauté.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <FieldLabel>Nom</FieldLabel>
                  <div className="font-semibold">{community.name}</div>
                </div>
                <div className="space-y-1">
                  <FieldLabel>Identifiant (slug)</FieldLabel>
                  <code className="rounded bg-slate-100 px-2 py-1 text-sm text-blue-700">/{community.slug}</code>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Politique d'adhésion</FieldLabel>
                  <PolicyBadge policy={community.joinPolicy} />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Visibilité</FieldLabel>
                  {community.extra?.isPublic ? (
                    <Badge className="bg-indigo-600 text-white gap-2">
                      <Globe className="h-3.5 w-3.5" /> Publique
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-2">
                      <Lock className="h-3.5 w-3.5" /> Privée
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <FieldLabel>Code d'invitation</FieldLabel>
                  {community.inviteCode ? (
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-emerald-50 text-emerald-700 px-2 py-1 text-sm">
                        {community.inviteCode}
                      </code>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={copyInvite} className="h-8 w-8">
                            {copyOk ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{copyOk ? 'Copié !' : 'Copier'}</TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun code requis</div>
                  )}
                </div>
                <div className="space-y-1">
                  <FieldLabel>Date de création</FieldLabel>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" /> {createdAtDisplay}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-3">
                <Button asChild variant="secondary" className="gap-2">
                  <Link href={`/c/${community.slug}`}>
                    <ExternalLink className="h-4 w-4" /> Visiter
                  </Link>
                </Button>
                <Button asChild className="gap-2">
                  <Link href="/admin">
                    <ArrowLeft className="h-4 w-4" /> Panneau d'admin
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Description & Feature Flags */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
              <CardHeader>
                <CardTitle>Présentation</CardTitle>
                <CardDescription>Résumé public de la communauté.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {community.description || (
                    <em className="text-muted-foreground">Aucune description fournie.</em>
                  )}
                </div>
              </CardContent>
            </Card>

            {community.extra && (
              <Card className="border-white/30 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
                <CardHeader>
                  <CardTitle>Fonctionnalités</CardTitle>
                  <CardDescription>Modules disponibles dans cette communauté.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <FeatureChip enabled={!!community.extra.allowPosts} label="Publications" desc="Création de posts" />
                  <FeatureChip enabled={!!community.extra.allowComments} label="Commentaires" desc="Commentaires sur les posts" />
                  <FeatureChip enabled={!!community.extra.allowPolls} label="Sondages" desc="Création et vote" />
                  <FeatureChip enabled={!!community.extra.allowServices} label="Services" desc="Demande et offre de services" />
                  <FeatureChip enabled={!!community.extra.allowMarketplace} label="Marketplace" desc="Vente et achat" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <div className="mt-8">
            <Card className="border-white/30 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Prochaines étapes
                </CardTitle>
                <CardDescription className="text-white/80">
                  Accélérez l'engagement et la personnalisation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-white/90">
                  <li>Invitez des membres à rejoindre votre communauté</li>
                  <li>Créez le premier post pour lancer l'activité</li>
                  <li>Définissez les règles et attribuez des modérateurs</li>
                  <li>Personnalisez l'apparence et la charte graphique</li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="secondary" className="bg-white text-indigo-700 hover:bg-white/90">
                  <Link href={`/c/${community.slug}`}>Visiter la communauté</Link>
                </Button>
                <Button asChild variant="outline" className="text-white border-white/40 hover:bg-white/10">
                  <Link href="/admin">Retour au panneau d'admin</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>

        {/* Delete Confirmation */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la communauté ?</DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Toutes les données associées à « {community.name} » seront supprimées définitivement.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" className="gap-2" onClick={onDelete}>
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

// ────────────────────────────────────────────────────────────
// Background decoration (soft blobs / glow)
// ────────────────────────────────────────────────────────────
function BackdropDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl"
      />
    </div>
  )
}
