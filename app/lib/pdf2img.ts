// // Used Ai to write the logic for converting the pdf to image
//
// export interface PdfConversionResult {
//     imageUrl: string;
//     file: File | null;
//     error?: string;
// }
//
// let pdfjsLib: any = null;
// let isLoading = false;
// let loadPromise: Promise<any> | null = null;
//
// async function loadPdfJs(): Promise<any> {
//     if (pdfjsLib) return pdfjsLib;
//     if (loadPromise) return loadPromise;
//
//     isLoading = true;
//     // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
//     loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
//         // Set the worker source to use local file
//         lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
//         pdfjsLib = lib;
//         isLoading = false;
//         return lib;
//     });
//
//     return loadPromise;
// }
//
// export async function convertPdfToImage(
//     file: File
// ): Promise<PdfConversionResult> {
//     try {
//         const lib = await loadPdfJs();
//
//         const arrayBuffer = await file.arrayBuffer();
//         const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
//         const page = await pdf.getPage(1);
//
//         const viewport = page.getViewport({ scale: 4 });
//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");
//
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//
//         if (context) {
//             context.imageSmoothingEnabled = true;
//             context.imageSmoothingQuality = "high";
//         }
//
//         await page.render({ canvasContext: context!, viewport }).promise;
//
//         return new Promise((resolve) => {
//             canvas.toBlob(
//                 (blob) => {
//                     if (blob) {
//                         // Create a File from the blob with the same name as the pdf
//                         const originalName = file.name.replace(/\.pdf$/i, "");
//                         const imageFile = new File([blob], `${originalName}.png`, {
//                             type: "image/png",
//                         });
//
//                         resolve({
//                             imageUrl: URL.createObjectURL(blob),
//                             file: imageFile,
//                         });
//                     } else {
//                         resolve({
//                             imageUrl: "",
//                             file: null,
//                             error: "Failed to create image blob",
//                         });
//                     }
//                 },
//                 "image/png",
//                 1.0
//             ); // Set quality to maximum (1.0)
//         });
//     } catch (err) {
//         return {
//             imageUrl: "",
//             file: null,
//             error: `Failed to convert PDF: ${err}`,
//         };
//     }
// }


// Used Ai to refactor the above commented code
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

// --- Singleton Pattern for loading pdf.js ---
// We use these variables to ensure the library is only fetched and initialized once.
let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

/**
 * Lazily loads the pdf.js library and its worker.
 * Uses a singleton pattern to prevent re-loading.
 * @returns A promise that resolves to the pdf.js library object.
 */
async function loadPdfJs(): Promise<any> {
    // If the library is already loaded, return it immediately.
    if (pdfjsLib) {
        return pdfjsLib;
    }
    // If loading is already in progress, return the existing promise.
    if (loadPromise) {
        return loadPromise;
    }

    // Start loading the library.
    // We use a dynamic import for lazy loading.
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // --- CRITICAL: Set the worker source ---
        // Using a CDN is the most reliable way to ensure the worker is found.
        // It avoids issues with local build configurations.
        lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.mjs`;

        // If you are SURE your build process copies the worker to your public folder,
        // you can use a local path instead:
        // lib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

/**
 * A helper function to promisify the canvas.toBlob method, making it compatible with async/await.
 * @param canvas The canvas element to convert to a blob.
 * @returns A Promise that resolves with the generated Blob.
 */
function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    // This will be caught by the main try...catch block.
                    reject(new Error("Failed to create image blob from canvas."));
                }
            },
            "image/png",
            1.0 // Use maximum quality
        );
    });
}

/**
 * Converts the first page of a given PDF file to a high-quality PNG image.
 * This function is now fully async and uses modern error handling.
 *
 * @param file The PDF file to convert.
 * @returns A promise that resolves to a PdfConversionResult object.
 */
export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        // 1. Ensure the PDF.js library is loaded.
        const lib = await loadPdfJs();

        // 2. Load the PDF document from the file's array buffer.
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1); // Get the first page.

        // 3. Set up the canvas for high-quality rendering.
        const viewport = page.getViewport({ scale: 4.0 }); // High scale for high resolution.
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Could not create 2D canvas context.");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // 4. Render the PDF page onto the canvas.
        await page.render({ canvasContext: context, viewport }).promise;

        // 5. Convert the canvas to a Blob using our new promisified helper.
        // This is now a clean, await-able step.
        const blob = await canvasToBlob(canvas);

        // 6. Create a File object from the blob.
        const originalName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([blob], `${originalName}.png`, {
            type: "image/png",
        });

        // 7. Return the successful result.
        return {
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
        };
    } catch (err: any) {
        // If any step in the try block fails, it will be caught here.
        console.error("PDF to Image conversion failed:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err.message || String(err)}`,
        };
    }
}
