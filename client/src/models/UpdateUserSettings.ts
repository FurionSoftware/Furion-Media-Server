import Library from "./Library";

export default interface UpdateUserSettings {
    newLibraries: Library[];
    existingLibraries: Library[];
    removedLibraries: Library[];
}