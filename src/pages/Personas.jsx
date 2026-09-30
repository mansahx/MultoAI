import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonas } from '../hooks/usePersonas';
import { PageHeader } from '../components/layout/PageHeader';
import { PersonaCard } from '../components/persona/PersonaCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { PlusCircle, UserCheck } from 'lucide-react';

export const Personas = () => {
  const navigate = useNavigate();
  const { personas, activePersona, setActivePersona, deletePersona, duplicatePersona } = usePersonas();
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deletePersona(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="User Personas"
        description="Create and manage multiple identities/personas to use when interacting with AI characters."
        action={
          <Button
            variant="accent"
            icon={PlusCircle}
            onClick={() => navigate('/personas/create')}
          >
            Create New Persona
          </Button>
        }
      />

      {personas.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No User Personas Yet"
          description="Create your first persona so AI characters recognize your background and identity during roleplay."
          actionText="Create New Persona"
          actionIcon={PlusCircle}
          onAction={() => navigate('/personas/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              isActive={activePersona?.id === persona.id}
              onSetActive={setActivePersona}
              onEdit={(id) => navigate(`/personas/${id}/edit`)}
              onDelete={(id) => setDeleteTargetId(id)}
              onDuplicate={duplicatePersona}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this Persona?"
        message="Are you sure you want to delete this persona from local storage?"
      />
    </div>
  );
};
