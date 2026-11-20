import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BackgroundVisualizationComponent } from "../background-visualization/background-visualization.component";
import { UserBarComponent } from "../user-bar/user-bar.component";
import { ProjectDetails } from "../project-details/project-details";
import { SceneList } from "../scene-list/scene-list";
import { ProjectService } from "../../api/services/project.service";
import {
  ProjectResponse,
  CreateProjectRequest,
  ProjectTemplate,
  UpdateProjectRequest,
} from "../../api/models/omega-api.models";
import { EditorService } from "@editor/services/editor.service";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import { DashboardWelcome } from "./components/dashboard-welcome/dashboard-welcome";
import { Icon } from "../icon/icon";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BackgroundVisualizationComponent,
    UserBarComponent,
    ProjectDetails,
    SceneList,
    DashboardWelcome,
    Icon,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements AfterViewInit, OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loadingService = inject(LoadingService);

  selectedProject: ProjectResponse | null = null;
  projects: ProjectResponse[] = [];

  isModalOpen = false;
  newProjectName = "";
  newProjectTemplate = "empty";
  templates: ProjectTemplate[] = [];
  createError = "";

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    this.loadingService.show();
  }

  ngAfterViewInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.listProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.selectedProject =
          this.projects.find(
            (o) => o.id == this.activatedRoute.snapshot.paramMap.get("project"),
          ) || null;
        this.loadingService.hide();
      },
      error: (err) => console.error("Failed to load projects", err),
    });
  }

  selectProject(project: ProjectResponse): void {
    this.editorService.gameEngine;
    this.selectedProject = project;
  }

  openNewProjectModal(): void {
    this.isModalOpen = true;
    this.projectService.listTemplates().subscribe({
      next: (templates) => (this.templates = templates),
      error: (err) => console.error("Failed to load project templates", err),
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.newProjectName = "";
    this.newProjectTemplate = "empty";
    this.createError = "";
  }

  createProject(): void {
    if (!this.newProjectName.trim()) {
      return; // Or show a validation message
    }

    const payload: CreateProjectRequest = {
      name: this.newProjectName.trim(),
      template: this.newProjectTemplate,
    };

    this.createError = "";
    this.projectService.createProject(payload).subscribe({
      next: (project) => {
        this.closeModal();
        this.projects = [...this.projects, project];
        this.selectedProject = project;
      },
      error: (err) => {
        console.error("Failed to create project", err);
        this.createError = err?.error?.detail ?? "Could not create the project.";
      },
    });
  }

  handleProjectUpdate(updatedProjectData: ProjectResponse): void {
    if (!updatedProjectData || !updatedProjectData.id) {
      console.error("Invalid project data received for update.");
      return;
    }

    const payload: UpdateProjectRequest = {
      name: updatedProjectData.name,
      description: updatedProjectData.description ?? undefined,
    };

    this.projectService
      .updateProject(updatedProjectData.id, payload)
      .subscribe({
        next: (savedProject) => {
          // Update the project in the main list
          const index = this.projects.findIndex(
            (p) => p.id === savedProject.id,
          );
          if (index !== -1) {
            this.projects[index] = savedProject;
          }

          // If the updated project is the currently selected one, update it
          if (
            this.selectedProject &&
            this.selectedProject.id === savedProject.id
          ) {
            this.selectedProject = { ...this.selectedProject, ...savedProject };
          }

          console.log("Project updated successfully", savedProject);
        },
        error: (err) => {
          console.error("Failed to update project", err);
          // Optionally, revert optimistic updates or show an error toast
        },
      });
  }
}
