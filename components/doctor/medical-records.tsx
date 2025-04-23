"use client";

import { useEffect, useState } from "react";
import { Eye, ChevronDown, ChevronUp, Search, User, FileText, ClipboardList, Stethoscope, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { diagnosisApi } from "@/services/api/diagnosis";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    diagnosisApi.getReviewedDiagnosesByDoctor()
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filteredRecords = records.filter((rec) => {
    const patientName = rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : "";
    return (
      patientName.toLowerCase().includes(search.toLowerCase()) ||
      rec.diagnosisId.toLowerCase().includes(search.toLowerCase()) ||
      rec.mlResults.severity.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-0">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reviewed Medical Records</CardTitle>
          <CardDescription>All diagnoses reviewed by you, with full patient and review details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient, diagnosis, severity..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading medical records...</div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No reviewed diagnoses found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date Reviewed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((rec) => {
                  const isOpen = expanded === rec.diagnosisId;
                  return (
                    <>
                      <TableRow key={rec.diagnosisId} className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={isOpen ? "Collapse details" : "Expand details"}
                            onClick={() => setExpanded(isOpen ? null : rec.diagnosisId)}
                          >
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : "Unknown"}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{rec.patient?.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rec.mlResults.prediction}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge color={rec.mlResults.severity === "severe" ? "destructive" : rec.mlResults.severity === "moderate" ? "warning" : "success"}>
                            {rec.mlResults.severity.charAt(0).toUpperCase() + rec.mlResults.severity.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{rec.reviewedAt ? new Date(rec.reviewedAt).toLocaleString() : "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rec.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <a href={rec.imageUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 text-primary" />
                          </a>
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow className="bg-slate-50 dark:bg-slate-900">
                          <TableCell colSpan={7}>
                            <div className="grid md:grid-cols-3 gap-6 py-4">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Patient Info</h4>
                                <div className="text-sm">
                                  <div><b>Name:</b> {rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : "Unknown"}</div>
                                  <div><b>Email:</b> {rec.patient?.email}</div>
                                  <div><b>DOB:</b> {rec.patient?.dateOfBirth ? new Date(rec.patient.dateOfBirth).toLocaleDateString() : "-"}</div>
                                  <div><b>Gender:</b> {rec.patient?.gender}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Diagnosis Details</h4>
                                <div className="text-sm">
                                  <div><b>Prediction:</b> {rec.mlResults.prediction}</div>
                                  <div><b>Severity:</b> {rec.mlResults.severity}</div>
                                  <div><b>Confidence:</b> {rec.mlResults.confidence}</div>
                                  <div><b>Affected Areas:</b> {rec.mlResults.affectedAreas?.join(", ")}</div>
                                  <div><b>Image:</b> <a href={rec.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View</a></div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Doctor Review</h4>
                                <div className="text-sm">
                                  <div><b>Review:</b> {rec.doctorReview?.review}</div>
                                  <div><b>Treatment Plan:</b> {rec.doctorReview?.treatmentPlan}</div>
                                  <div><b>Updated Severity:</b> {rec.doctorReview?.updatedSeverity}</div>
                                  <div><b>Reviewed At:</b> {rec.doctorReview?.reviewedAt ? new Date(rec.doctorReview.reviewedAt).toLocaleString() : "-"}</div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
