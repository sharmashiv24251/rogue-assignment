"use client";

import { useState } from "react";
import ContactCard from "./ContactCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusCircle, Search, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type ContactCardType = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

const ContactCardPage = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contactCards, setContactCards] = useState<ContactCardType[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "2345678901",
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      phone: "3456789012",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice.brown@example.com",
      phone: "4567890123",
    },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      phone: "5678901234",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function deleteContactCard(index: number) {
    setContactCards((prevContactCards) => {
      const newContactCards = [...prevContactCards];
      newContactCards.splice(index, 1);
      return newContactCards;
    });
  }

  function addContactCard(contactCard: ContactCardType) {
    setContactCards((prevContactCards) => {
      const newContactCards = [...prevContactCards];
      newContactCards.push(contactCard);
      return newContactCards;
    });
  }

  function editContactCard(index: number, contactCard: ContactCardType) {
    setContactCards((prevContactCards) => {
      const newContactCards = [...prevContactCards];
      newContactCards[index] = contactCard;
      return newContactCards;
    });
    setEditingId(null);
  }

  // Filter contacts based on search query
  const filteredContacts = contactCards.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header with gradient background */}
        <div className="relative mb-12 text-center py-10 px-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/30 rounded-t-2xl"></div>

          <div className="flex justify-center mb-4">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-16 h-16">
              <Users className="w-8 h-8 text-primary/80" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3">
            Contact Manager
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your contacts efficiently with our easy-to-use contact
            management system. Add, edit, or remove contacts with just a few
            clicks.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center w-full md:w-auto">
            <h2 className="text-2xl font-semibold text-foreground mr-2">
              Your Contacts
            </h2>
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              {contactCards.length}
            </span>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Add Contact Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 max-w-md">
                <h3 className="text-xl font-bold mb-4">Add New Contact</h3>
                <ContactCard
                  isEditing={true}
                  onCancel={() => setIsDialogOpen(false)}
                  onSave={(contact) => {
                    addContactCard(contact);
                    setIsDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Empty state */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-xl bg-background">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center items-center bg-primary/5 rounded-full w-16 h-16">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">No contacts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Add some contacts to get started."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Contact cards grid */}
        {filteredContacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contactCard, index) => (
              <ContactCard
                key={contactCard.id}
                {...contactCard}
                isEditing={editingId === contactCard.id}
                onEdit={(contact) =>
                  editingId === null
                    ? setEditingId(contact.id)
                    : editContactCard(index, contact)
                }
                onDelete={() => deleteContactCard(index)}
                onCancel={() => setEditingId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCardPage;
