class CourseService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const courses = response.data.map(course => ({
        Id: course.Id,
        name: course.Name,
        code: course.code_c,
        instructor: course.instructor_c,
        schedule: course.schedule_c,
        location: course.location_c,
        color: course.color_c,
        credits: course.credits_c,
        semester: course.semester_c,
        tags: course.Tags
      }));

      return courses;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error("Error fetching courses:", error);
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
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "semester_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      const course = {
        Id: response.data.Id,
        name: response.data.Name,
        code: response.data.code_c,
        instructor: response.data.instructor_c,
        schedule: response.data.schedule_c,
        location: response.data.location_c,
        color: response.data.color_c,
        credits: response.data.credits_c,
        semester: response.data.semester_c,
        tags: response.data.Tags
      };

      return course;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching course with ID ${id}:`, error);
      }
      throw error;
    }
  }

  async create(courseData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Name: courseData.name,
        Tags: courseData.tags || '',
        code_c: courseData.code,
        instructor_c: courseData.instructor,
        schedule_c: courseData.schedule,
        location_c: courseData.location,
        color_c: courseData.color,
        credits_c: parseInt(courseData.credits),
        semester_c: courseData.semester
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
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create course");
        }

        // Transform back to UI format
        const createdRecord = successfulRecords[0].data;
        return {
          Id: createdRecord.Id,
          name: createdRecord.Name,
          code: createdRecord.code_c,
          instructor: createdRecord.instructor_c,
          schedule: createdRecord.schedule_c,
          location: createdRecord.location_c,
          color: createdRecord.color_c,
          credits: createdRecord.credits_c,
          semester: createdRecord.semester_c,
          tags: createdRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error("Error creating course:", error);
      }
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      // Transform UI fields to database fields - only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: courseData.name,
        Tags: courseData.tags || '',
        code_c: courseData.code,
        instructor_c: courseData.instructor,
        schedule_c: courseData.schedule,
        location_c: courseData.location,
        color_c: courseData.color,
        credits_c: parseInt(courseData.credits),
        semester_c: courseData.semester
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
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update course");
        }

        // Transform back to UI format
        const updatedRecord = successfulUpdates[0].data;
        return {
          Id: updatedRecord.Id,
          name: updatedRecord.Name,
          code: updatedRecord.code_c,
          instructor: updatedRecord.instructor_c,
          schedule: updatedRecord.schedule_c,
          location: updatedRecord.location_c,
          color: updatedRecord.color_c,
          credits: updatedRecord.credits_c,
          semester: updatedRecord.semester_c,
          tags: updatedRecord.Tags
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error("Error updating course:", error);
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
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error("Failed to delete course");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error("Error deleting course:", error);
      }
      throw error;
    }
  }
}

export const courseService = new CourseService()