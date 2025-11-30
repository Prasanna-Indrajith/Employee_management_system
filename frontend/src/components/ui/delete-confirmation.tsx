import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DeleteConfirmationCardProps {
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationCard({
  title = 'Are you sure?',
  description = 'By continuing this action, the selected employee will be permanently deleted and cannot be recovered.',
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationCardProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <CardDescription className="text-base">{description}</CardDescription>
          {itemName && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <span className="font-medium">Employee to be deleted:</span>{' '}
                {itemName}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 pt-0">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Example usage component
export function DeleteConfirmationExample() {
  const [showDeleteCard, setShowDeleteCard] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Employee deleted successfully!');
    setIsDeleting(false);
    setShowDeleteCard(false);

    // Show success message or redirect
    alert('Employee deleted successfully!');
  };

  const handleCancelDelete = () => {
    setShowDeleteCard(false);
  };

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-4">Delete Confirmation Demo</h2> */}

      <div className="space-y-4">
        <Button variant="destructive" onClick={() => setShowDeleteCard(true)}>
          Delete Employee
        </Button>
      </div>

      {showDeleteCard && (
        <DeleteConfirmationCard
          title="Delete Employee?"
          description="By continuing this action, the employee will be permanently removed from the system. All associated data will be lost."
          itemName="John Doe (Senior Developer)"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
