/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { Button, FormControl, FormLabel, Paper, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import PropertyInput from "./PropertyInput";
import PropertySelector from "./PropertySelector";
import Modal from "components/shared/Modal";
import { ologApi } from "api/ologApi";

const PropertyCollectionInput = ({ control, className }) => {
  const [showAddProperty, setShowAddProperty] = useState(false);
  const { data: availableProperties } =
    ologApi.endpoints.getProperties.useQuery();

  const {
    fields: properties,
    remove: removeProperty,
    append: appendProperty,
    update: updateProperty
  } = useFieldArray({
    control,
    name: "properties",
    keyName: "reactHookFormId" // default is 'id', which would override OlogAttachment#id
  });

  const allPropertiesSelected = useMemo(() => {
    return (
      availableProperties?.filter((it) => it.name !== "Log Entry Group")
        ?.length ===
      properties?.filter((it) => it.name !== "Log Entry Group")?.length
    );
  }, [availableProperties, properties]);

  // Close the Properties dialog if there are none left to select
  useEffect(() => {
    if (allPropertiesSelected) {
      setShowAddProperty(false);
    }
  }, [allPropertiesSelected, setShowAddProperty]);

  // Render, but visually hide, any group properties
  // React Hook Form stores state in the form elements so they
  // must be rendered even if they shouldn't be edited
  const renderedProperties = properties.map((property, index) => {
    return (
      <PropertyInput
        key={index}
        index={index}
        control={control}
        property={property}
        removeProperty={removeProperty}
        updateProperty={updateProperty}
        hidden={property.name === "Log Entry Group"}
      />
    );
  });

  return (
    <FormControl className={className}>
      <FormLabel>Properties</FormLabel>
      <Paper
        variant="outlined"
        component={Stack}
        padding={1}
        gap={1}
      >
        <Button
          variant="outlined"
          disabled={allPropertiesSelected}
          onClick={() => {
            setShowAddProperty(true);
          }}
          startIcon={<AddIcon />}
        >
          Add Property
        </Button>
        {renderedProperties}
      </Paper>
      <Modal
        open={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        title="Add Property"
        content={
          <PropertySelector
            availableProperties={availableProperties}
            selectedProperties={properties}
            addProperty={appendProperty}
          />
        }
      />
    </FormControl>
  );
};

export default PropertyCollectionInput;
