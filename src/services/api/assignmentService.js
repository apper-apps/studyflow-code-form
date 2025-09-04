class AssignmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const assignments = response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        title: assignment.title_c,
        type: assignment.type_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c,
        notes: assignment.notes_c,
        tags: assignment.Tags
      }));

      return assignments;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments:", error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const assignment = {
        Id: response.data.Id,
        courseId: response.data.course_id_c?.Id || response.data.course_id_c,
        title: response.data.title_c,
        type: response.data.type_c,
        dueDate: response.data.due_date_c,
        priority: response.data.priority_c,
        status: response.data.status_c,
        grade: response.data.grade_c,
        weight: response.data.weight_c,
        notes: response.data.notes_c,
        tags: response.data.Tags
      };

      return assignment;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error);
      }
      throw error;
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const assignments = response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        title: assignment.title_c,
        type: assignment.type_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c,
        notes: assignment.notes_c,
        tags: assignment.Tags
      }));

      return assignments;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments by course:", error);
      }
      throw error;
    }
  }

  async create(assignmentData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Name: assignmentData.title,
        Tags: assignmentData.tags || '',
        course_id_c: parseInt(assignmentData.courseId),
        title_c: assignmentData.title,
        type_c: assignmentData.type,
        due_date_c: assignmentData.dueDate,
        priority_c: assignmentData.priority,
        status_c: assignmentData.status,
        grade_c: assignmentData.grade || null,
        weight_c: assignmentData.weight || 10,
        notes_c: assignmentData.notes || ''
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create assignment");
        }

        // Transform back to UI format
        const createdRecord = successfulRecords[0].data;
        return {
          Id: createdRecord.Id,
          courseId: createdRecord.course_id_c?.Id || createdRecord.course_id_c,
          title: createdRecord.title_c,
          type: createdRecord.type_c,
          dueDate: createdRecord.due_date_c,
          priority: createdRecord.priority_c,
          status: createdRecord.status_c,
          grade: createdRecord.grade_c,
          weight: createdRecord.weight_c,
          notes: createdRecord.notes_c,
          tags: createdRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error creating assignment:", error);
      }
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: assignmentData.title,
        Tags: assignmentData.tags || '',
        course_id_c: parseInt(assignmentData.courseId),
        title_c: assignmentData.title,
        type_c: assignmentData.type,
        due_date_c: assignmentData.dueDate,
        priority_c: assignmentData.priority,
        status_c: assignmentData.status,
        grade_c: assignmentData.grade || null,
        weight_c: assignmentData.weight || 10,
        notes_c: assignmentData.notes || ''
      };

      const params = {
        records: [dbData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update assignment");
        }

        // Transform back to UI format
        const updatedRecord = successfulUpdates[0].data;
        return {
          Id: updatedRecord.Id,
          courseId: updatedRecord.course_id_c?.Id || updatedRecord.course_id_c,
          title: updatedRecord.title_c,
          type: updatedRecord.type_c,
          dueDate: updatedRecord.due_date_c,
          priority: updatedRecord.priority_c,
          status: updatedRecord.status_c,
          grade: updatedRecord.grade_c,
          weight: updatedRecord.weight_c,
          notes: updatedRecord.notes_c,
          tags: updatedRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error updating assignment:", error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete assignment");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting assignment:", error);
      }
      throw error;
    }
  }
}

export const assignmentService = new AssignmentService()