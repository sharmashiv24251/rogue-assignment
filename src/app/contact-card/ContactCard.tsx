import React, { useState } from "react";
import { ContactCardType } from "./page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Mail, Phone, User, Save, X, Edit, Trash2 } from "lucide-react";

const contactSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

type ValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

interface ContactCardProps extends Partial<ContactCardType> {
  onEdit?: (contact: ContactCardType) => void;
  onDelete?: (contact: ContactCardType) => void;
  onSave?: (contact: ContactCardType) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ContactCard = (contactCardsProps: ContactCardProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [editedContact, setEditedContact] = useState<ContactCardType>({
    id: contactCardsProps.id || Math.floor(Math.random() * 10000),
    name: contactCardsProps.name || "",
    email: contactCardsProps.email || "",
    phone: contactCardsProps.phone || "",
  });

  const handleSave = () => {
    const result = contactSchema.safeParse(editedContact);
    if (!result.success) {
      const formattedErrors: ValidationErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ValidationErrors;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }
    setErrors({});
    if (contactCardsProps.onSave) {
      contactCardsProps.onSave(editedContact);
    } else if (contactCardsProps.onEdit) {
      contactCardsProps.onEdit(editedContact);
    }
  };

  return (
    <Card className="flex flex-col p-6 gap-4 hover:shadow-xl transition-all duration-300 rounded-xl border-2 overflow-hidden relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/80 to-primary/30"></div>

      {contactCardsProps.isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="text-muted-foreground" size={18} />
            <div className="w-full">
              <Input
                value={editedContact.name}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, name: e.target.value })
                }
                placeholder="Name"
                className={`focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? "border-red-500" : ""
                }`}
                aria-invalid={!!errors.name}
                aria-errormessage={errors.name}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, name: undefined }))
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="text-muted-foreground" size={18} />
            <div className="w-full">
              <Input
                value={editedContact.email}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, email: e.target.value })
                }
                placeholder="Email"
                className={`focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-red-500" : ""
                }`}
                aria-invalid={!!errors.email}
                aria-errormessage={errors.email}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="text-muted-foreground" size={18} />
            <div className="w-full">
              <Input
                value={editedContact.phone}
                onChange={(e) =>
                  setEditedContact({ ...editedContact, phone: e.target.value })
                }
                placeholder="Phone (10 digits)"
                className={`focus:ring-2 focus:ring-primary/20 ${
                  errors.phone ? "border-red-500" : ""
                }`}
                aria-invalid={!!errors.phone}
                aria-errormessage={errors.phone}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, phone: undefined }))
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-12 h-12">
              <span className="text-xl font-bold">
                {contactCardsProps.name
                  ? contactCardsProps.name.charAt(0).toUpperCase()
                  : ""}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {contactCardsProps.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Contact #{contactCardsProps.id}
              </p>
            </div>
          </div>

          <div className="pl-2 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="text-primary/60" size={16} />
              <span className="text-sm">{contactCardsProps.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="text-primary/60" size={16} />
              <span className="text-sm">
                {contactCardsProps.phone?.replace(
                  /(\d{3})(\d{3})(\d{4})/,
                  "($1) $2-$3"
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 mt-2 border-t border-border flex justify-end items-center gap-2">
        {contactCardsProps.isEditing ? (
          <>
            <Button
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-1"
            >
              <Save size={16} />
              Save
            </Button>
            {contactCardsProps.onCancel && (
              <Button
                variant="outline"
                onClick={contactCardsProps.onCancel}
                size="sm"
                className="flex items-center gap-1"
              >
                <X size={16} />
                Cancel
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-primary/10"
              onClick={() =>
                contactCardsProps.onEdit?.(contactCardsProps as ContactCardType)
              }
            >
              <Edit size={16} />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-red-100 text-red-500"
              onClick={() =>
                contactCardsProps.onDelete?.(
                  contactCardsProps as ContactCardType
                )
              }
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ContactCard;
