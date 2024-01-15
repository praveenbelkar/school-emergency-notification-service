export const idmSoapRequestTemplate = (schoolCode: string): string =>
  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="ws.idmservice.det.nsw.edu.au">
      <soapenv:Header/>
      <soapenv:Body>
        <ws:getGenericStaffList>
            <criteria>
              <!--Zero or more repetitions:-->
              <item>
                <Name>DETPEPLocation</Name>
                <Value>${schoolCode}</Value>
                <filter>EQUALS</filter>
              </item>
            </criteria>
        </ws:getGenericStaffList>
      </soapenv:Body>
  </soapenv:Envelope>`;
