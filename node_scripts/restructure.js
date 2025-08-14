// utils/restructure.js

const fs = require('fs');
// If you're using the uuid package, you would import it here:
// const { v4: uuidv4 } = require('uuid');

// A simple utility to generate UUIDs if a library is not available
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Reads a JSON file, restructures the data, and saves it to a new file.
 * @param {string} sourcePath The path to the source JSON file.
 * @param {string} targetPath The path to the target JSON file.
 */
function restructureData(sourcePath, targetPath) {
    try {
        const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

        const restructuredData = [];

        // Ensure sourceData is an array to handle both single and multiple objects
        const dataToProcess = Array.isArray(sourceData) ? sourceData : [sourceData];

        dataToProcess.forEach(item => {
            try {
                // Generate a unique ID for the connection
                const connectionId = generateUUID();
                
                // Get the entity types from the source data
                const entityAType = item['Entity A Type'];
                const entityBType = item['Entity B Type'];
                
                // Dynamically create the entity IDs with the correct type prefix
                const entityAId = `${entityAType.toLowerCase()}-${generateUUID()}`;
                const entityBId = `${entityBType.toLowerCase()}-${generateUUID()}`;
                
                // Assuming 'Connection' always represents the role and dates are not present
                const role = item.Connection;

                const newItem = {
                    connection_id: connectionId,
                    entities: [
                        {
                            entity_id: entityAId,
                            entity_type: entityAType,
                            entity_name: item['Entity A']
                        },
                        {
                            entity_id: entityBId,
                            entity_type: entityBType,
                            entity_name: item['Entity B']
                        }
                    ],
                    relationship: {
                        type: 'Employment', // The type of relationship is assumed to be 'Employment'
                        role: role,
                        start_date: null,
                        end_date: null
                    },
                    sources: [
                        {
                            source_id: `source-${generateUUID()}`,
                            url: item['Source(s)']
                        }
                    ],
                    metadata: {
                        created_at: new Date().toISOString()
                    }
                };
                restructuredData.push(newItem);

            } catch (e) {
                console.error(`Failed to process an item. Error: ${e}`);
            }
        });

        fs.writeFileSync(targetPath, JSON.stringify(restructuredData, null, 2), 'utf8');
        console.log(`Successfully restructured ${restructuredData.length} items and saved to ${targetPath}`);

    } catch (e) {
        console.error(`Error during file processing: ${e.message}`);
    }
}

module.exports = restructureData;