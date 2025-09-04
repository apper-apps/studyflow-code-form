class GradeService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "earned_c" } },
          { field: { Name: "total_c" } }
        ],
        orderBy: [
          { fieldName: "course_id_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const grades = response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c,
        category: grade.category_c,
        weight: grade.weight_c,
        earned: grade.earned_c,
        total: grade.total_c,
        tags: grade.Tags
      }));

      return grades;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades:", error);
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
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "earned_c" } },
          { field: { Name: "total_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const grade = {
        Id: response.data.Id,
        courseId: response.data.course_id_c?.Id || response.data.course_id_c,
        category: response.data.category_c,
        weight: response.data.weight_c,
        earned: response.data.earned_c,
        total: response.data.total_c,
        tags: response.data.Tags
      };

      return grade;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error);
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
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "earned_c" } },
          { field: { Name: "total_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          { fieldName: "category_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const grades = response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || grade.course_id_c,
        category: grade.category_c,
        weight: grade.weight_c,
        earned: grade.earned_c,
        total: grade.total_c,
        tags: grade.Tags
      }));

      return grades;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by course:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades by course:", error);
      }
      throw error;
    }
  }

  async create(gradeData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Name: gradeData.category,
        Tags: gradeData.tags || '',
        course_id_c: parseInt(gradeData.courseId),
        category_c: gradeData.category,
        weight_c: gradeData.weight,
        earned_c: gradeData.earned,
        total_c: gradeData.total
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
          console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create grade");
        }

        // Transform back to UI format
        const createdRecord = successfulRecords[0].data;
        return {
          Id: createdRecord.Id,
          courseId: createdRecord.course_id_c?.Id || createdRecord.course_id_c,
          category: createdRecord.category_c,
          weight: createdRecord.weight_c,
          earned: createdRecord.earned_c,
          total: createdRecord.total_c,
          tags: createdRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error("Error creating grade:", error);
      }
      throw error;
    }
  }

  async update(id, gradeData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: gradeData.category,
        Tags: gradeData.tags || '',
        course_id_c: parseInt(gradeData.courseId),
        category_c: gradeData.category,
        weight_c: gradeData.weight,
        earned_c: gradeData.earned,
        total_c: gradeData.total
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
          console.error(`Failed to update grade ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update grade");
        }

        // Transform back to UI format
        const updatedRecord = successfulUpdates[0].data;
        return {
          Id: updatedRecord.Id,
          courseId: updatedRecord.course_id_c?.Id || updatedRecord.course_id_c,
          category: updatedRecord.category_c,
          weight: updatedRecord.weight_c,
          earned: updatedRecord.earned_c,
          total: updatedRecord.total_c,
          tags: updatedRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
      } else {
        console.error("Error updating grade:", error);
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
          console.error(`Failed to delete grade ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete grade");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error("Error deleting grade:", error);
      }
      throw error;
    }
  }
}

export const gradeService = new GradeService()