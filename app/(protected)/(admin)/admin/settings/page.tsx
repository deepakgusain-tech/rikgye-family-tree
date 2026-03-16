"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  Trash2,
  Pencil,
  Settings,
  Mail,
  FileText,
} from "lucide-react";

import { motion } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Template = {
  id: string;
  name: string;
  description: string;
};

type SettingsForm = {
  id: string;
  siteTitle: string;
  siteKeywords: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  isSMTP: boolean;
  host: string;
  username: string;
  password: string;
  port: number | null;
};

export default function SettingsPage() {
  const [formData, setFormData] = useState<SettingsForm>({
    id: "",
    siteTitle: "",
    siteKeywords: "",
    siteDescription: "",
    siteUrl: "",
    logo: "",
    favicon: "",
    isSMTP: false,
    host: "",
    username: "",
    password: "",
    port: null,
  });

  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTemplateName, setEditTemplateName] = useState("");
  const [editTemplateDescription, setEditTemplateDescription] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "favicon",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setFormData({
      ...formData,
      [field]: preview,
    });
  };

  const getData = async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data) setFormData(data);
  };

  const handleSave = async () => {
    setLoading(true);

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    setSuccessOpen(true);
  };

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    if (Array.isArray(data)) setTemplates(data);
  };

  const createTemplate = async () => {
    if (!templateName) return;

    setTemplateLoading(true);

    await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: templateName,
        description: templateDescription,
      }),
    });

    setTemplateName("");
    setTemplateDescription("");

    fetchTemplates();
    setTemplateLoading(false);
  };

  const deleteTemplate = async (id: string) => {
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    fetchTemplates();
  };

  const openEditDialog = (template: Template) => {
    setEditingId(template.id);
    setEditTemplateName(template.name);
    setEditTemplateDescription(template.description);
    setEditOpen(true);
  };

  const updateTemplate = async () => {
    if (!editingId) return;

    await fetch(`/api/templates/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editTemplateName,
        description: editTemplateDescription,
      }),
    });

    setEditOpen(false);
    setEditingId(null);
    fetchTemplates();
  };

  useEffect(() => {
    getData();
    fetchTemplates();
  }, []);

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
      <div>
        <h1 className="text-3xl font-bold text-green-800">Settings</h1>
        <p className="text-green-700 text-sm">
          Manage your application settings
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 w-[420px] bg-green-100 border border-green-200">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>

          <TabsTrigger
            value="mail"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Mail
          </TabsTrigger>

          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general">
          <Card className="p-6 space-y-6 max-w-3xl bg-white border border-green-200 shadow-md">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">
                  Site Title
                </label>
                <Input
                  placeholder="Site Title"
                  value={formData.siteTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, siteTitle: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">
                  Site URL
                </label>
                <Input
                  placeholder="Site URL"
                  value={formData.siteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, siteUrl: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">
                    Logo
                  </label>

                  {formData.logo && (
                    <div className="border rounded-md p-2 w-fit bg-green-50">
                      <img
                        src={formData.logo}
                        alt="logo"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "logo")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">
                    Favicon
                  </label>

                  {formData.favicon && (
                    <div className="border rounded-md p-2 w-fit bg-green-50">
                      <img
                        src={formData.favicon}
                        alt="favicon"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "favicon")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">
                  Site Keywords
                </label>
                <Input
                  placeholder="Site Keywords"
                  value={formData.siteKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, siteKeywords: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">
                  Site Description
                </label>
                <Textarea
                  placeholder="Site Description"
                  value={formData.siteDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      siteDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Saving
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Card>
        </TabsContent>

        {/* MAIL */}
        {/* MAIL */}
        <TabsContent value="mail">
          <Card className="p-6 space-y-6 max-w-3xl bg-white border border-green-200 shadow-md">
            {/* SMTP ENABLE */}
            <div className="flex items-center justify-between border rounded-lg p-4 bg-green-50">
              <div>
                <p className="font-medium text-green-800">Enable SMTP</p>
                <p className="text-sm text-green-600">
                  Use external SMTP mail server
                </p>
              </div>

              <Switch
                checked={formData.isSMTP}
                onCheckedChange={(v) => setFormData({ ...formData, isSMTP: v })}
              />
            </div>

            {/* SMTP SETTINGS */}
            {formData.isSMTP && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">
                    SMTP Host
                  </label>
                  <Input
                    placeholder="smtp.gmail.com"
                    value={formData.host}
                    onChange={(e) =>
                      setFormData({ ...formData, host: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">
                      SMTP Port
                    </label>
                    <Input
                      type="number"
                      placeholder="587"
                      value={formData.port ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          port: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">
                      Encryption
                    </label>
                    <Input placeholder="TLS / SSL" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">
                    SMTP Username
                  </label>
                  <Input
                    placeholder="email@example.com"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-800">
                    SMTP Password
                  </label>
                  <Input
                    type="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Mail Settings
            </Button>
          </Card>
        </TabsContent>

        {/* TEMPLATES */}
        <TabsContent value="templates">
          <Card className="p-6 space-y-6 max-w-3xl bg-white border border-green-200 shadow-md">
            <Accordion type="multiple">
              <AccordionItem value="create">
                <AccordionTrigger className="text-green-800 font-semibold">
                  Create Template
                </AccordionTrigger>

                <AccordionContent className="space-y-4">
                  <Input
                    placeholder="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />

                  <Editor
                    apiKey="9b9wji2lpvz93l03y7ai6kb09gpxzcpsnrxemixdpbpsuq8l"
                    value={templateDescription}
                    onEditorChange={(content) =>
                      setTemplateDescription(content)
                    }
                    init={{
                      height: 300,
                      menubar: false,
                    }}
                  />

                  <Button
                    onClick={createTemplate}
                    disabled={templateLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {templateLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Creating
                      </>
                    ) : (
                      "Create Template"
                    )}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((t) => (
                <Card
                  key={t.id}
                  className="p-4 relative border border-green-200 bg-green-50 hover:bg-green-100 transition"
                >
                  <h4 className="font-semibold text-green-800">{t.name}</h4>

                  <div
                    className="text-sm text-green-700 mt-2"
                    dangerouslySetInnerHTML={{ __html: t.description }}
                  />

                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => openEditDialog(t)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteTemplate(t.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SUCCESS MODAL */}

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="bg-green-50 border border-green-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle2 className="text-green-700 w-14 h-14 mx-auto mb-4" />

            <DialogTitle>Settings Saved 🎉</DialogTitle>

            <DialogDescription>
              Your changes were saved successfully.
            </DialogDescription>

            <Button
              className="mt-6 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setSuccessOpen(false)}
            >
              Close
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
      {/* EDIT TEMPLATE DIALOG */}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>Update template content</DialogDescription>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Template Name"
              value={editTemplateName}
              onChange={(e) => setEditTemplateName(e.target.value)}
            />

            <Editor
              apiKey="9b9wji2lpvz93l03y7ai6kb09gpxzcpsnrxemixdpbpsuq8l"
              value={editTemplateDescription}
              onEditorChange={(content) => setEditTemplateDescription(content)}
              init={{
                height: 300,
                menubar: false,
              }}
            />

            <Button
              onClick={updateTemplate}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              Update Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
