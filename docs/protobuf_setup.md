# Protocol Buffer Setup and Usage

This document outlines how Protocol Buffers (Protobuf) are used in this project for data serialization and how to manage the associated generated code.

## Overview

This dashboard uses Protocol Buffers to define the structure of data exchanged with the vehicle. The Protobuf definitions (`.proto` files) are the single source of truth for the data format.

- **Definitions Location:** `.proto/` directory
- **Main Definition File:** `vehicle_data.proto`

## Regenerating Protobuf JavaScript Files

If you make any changes to the `.proto` definition files (e.g., adding new messages, fields, or modifying existing ones in `vehicle_data.proto`), you **must** regenerate the corresponding JavaScript files that the dashboard application uses.

### Prerequisites

1.  **Protocol Buffer Compiler (`protoc`):**
    *   This core tool compiles `.proto` files into code for various languages.
    *   It must be installed on your system and accessible via your system's PATH.
    *   You can download it from the [official Protocol Buffers release page](https://github.com/protocolbuffers/protobuf/releases).

2.  **`google-protobuf` npm package:**
    *   This package provides two essential things:
        1.  The JavaScript runtime library required for using generated Protobuf messages.
        2.  The `protoc-gen-js` plugin, which `protoc` uses to generate JavaScript-specific code.
    *   It is listed as a `devDependency` in the project's `package.json` file.
    *   Ensure it's installed by running `npm install` in the project root if you haven't already.

### Generation Command

To regenerate the JavaScript files, use the following npm script defined in `package.json`:

```bash
npm run build:protos
```

Running this command from the project's root directory will:
1.  Invoke `protoc`.
2.  Use the `protoc-gen-js` plugin (found via `.\\node_modules\\google-protobuf\\bin\\protoc-gen-js.exe` as specified in the script).
3.  Read the definitions from the `.proto/` directory (specifically `vehicle_data.proto`).
4.  Output the generated JavaScript files (e.g., `vehicle_data_pb.js`) into the `generated-protos/` directory.

### Important Notes

-   **Do Not Manually Edit Generated Files:** The files within the `generated-protos/` directory are machine-generated. Any manual modifications will be lost the next time `npm run build:protos` is executed.
-   **Commit Generated Files:** It's generally recommended to commit the generated `*_pb.js` files to your version control system. This means that other developers (or your CI/CD pipeline) don't necessarily need to have `protoc` and the whole Protobuf generation toolchain set up just to run the application.

This process ensures that your application's data handling logic stays in sync with the defined data structures. 