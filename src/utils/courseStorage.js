export function getCourses() {
  const courses = localStorage.getItem("courses");
  return courses ? JSON.parse(courses) : [];
}

export function getCourseById(id) {
  const courses = getCourses();
  return courses.find((course) => String(course.id) === String(id));
}
