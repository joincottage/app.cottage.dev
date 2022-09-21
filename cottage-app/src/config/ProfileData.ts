interface ProfileData {
  name: string; // e.g. "Gavin Neil"
  avatarUrl: string; // e.g. "https://storage.googleapis.com/cottage-assets/mock-avatar-image.png"
  username: string; // e.g. "@gavin"
  location: string; // e.g. "Ottawa, ON, Canada"
  hourlyRate: string; // e.g. "$85/hr"
  skills: string[]; // e.g. ["Product Management", "Copywriting", "Advisory", "Mentorship"]
  aboutMe: string; // e.g. "I'm the founder of..."
  projects: any[];
  education: any[];
  recordId: string;
}

// https://www.geeksforgeeks.org/what-is-export-default-in-javascript/
export default ProfileData;
