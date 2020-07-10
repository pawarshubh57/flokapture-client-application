<%@ WebHandler Language="C#" Class="RemoveFiles" %>

using System.Web;
using System.IO;

public class RemoveFiles : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        System.Collections.Specialized.NameValueCollection s = context.Request.Params;
        string fileName = s["fileNames"];
        string targetFolder = HttpContext.Current.Server.MapPath("UploadFiles");
        if (!Directory.Exists(targetFolder))
        {
            Directory.CreateDirectory(targetFolder);
        }

        string physicalPath = targetFolder + "\\" + fileName;
        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}
