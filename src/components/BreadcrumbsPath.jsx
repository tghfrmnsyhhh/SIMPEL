import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const BreadcrumbsPath = ({ paths }) => {
  if (!Array.isArray(paths)) return null;

  return (
    <Breadcrumb fontSize="sm" mb={1} color="gray.600" fontWeight="bold">
      {paths.map((item, index) => (
        <BreadcrumbItem key={index} isCurrentPage={index === paths.length - 1}>
          {item.link ? (
            <BreadcrumbLink as={Link} to={item.link}>
              {item.label}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbLink>{item.label}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbsPath;
